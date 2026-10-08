import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import API, { probeBackendHealth } from '../services/api';

const INITIAL_ENDPOINTS = {
  health: {
    id: 'health',
    label: 'Core Gateway',
    endpoint: 'health/',
    status: 'pending', // 'pending' | 'checking' | 'ready' | 'error'
    latencyMs: 0,
  },
  ats: {
    id: 'ats',
    label: 'Dynamic ATS Engine',
    endpoint: 'resume-ats-score/',
    status: 'pending',
    latencyMs: 0,
  },
  projects: {
    id: 'projects',
    label: 'Projects & AI Subsystem',
    endpoint: 'projects/',
    status: 'pending',
    latencyMs: 0,
  },
};

const BackendStatusContext = createContext({
  stage: 'probing', // 'probing' | 'waking_server' | 'verifying_endpoints' | 'all_ready'
  isOnline: false,
  isWaking: false,
  isVerifying: false,
  allEndpointsReady: false,
  latencyMs: 0,
  elapsedSeconds: 0,
  estimatedRemaining: 40,
  stage1Progress: 10,
  stage2Progress: 0,
  endpoints: INITIAL_ENDPOINTS,
  completedEndpointsCount: 0,
  totalEndpointsCount: 3,
  probeNow: () => {},
  verifyEndpoints: () => {},
});

export const useBackendStatus = () => useContext(BackendStatusContext);

export function BackendStatusProvider({ children }) {
  const [stage, setStage] = useState('probing');
  const [latencyMs, setLatencyMs] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [endpoints, setEndpoints] = useState(INITIAL_ENDPOINTS);

  const timerRef = useRef(null);
  const serverPollingRef = useRef(null);
  const mountedRef = useRef(true);

  const completedEndpointsCount = Object.values(endpoints).filter((e) => e.status === 'ready').length;
  const totalEndpointsCount = Object.keys(INITIAL_ENDPOINTS).length;
  const allEndpointsReady = completedEndpointsCount === totalEndpointsCount;

  const isWaking = stage === 'waking_server';
  const isVerifying = stage === 'verifying_endpoints';
  const isOnline = allEndpointsReady || stage === 'all_ready';

  // Stage 2: Verify all 3 endpoints concurrently
  const verifyEndpoints = useCallback(async () => {
    if (!mountedRef.current) return;
    setStage('verifying_endpoints');

    // Mark all as checking
    setEndpoints((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k].status !== 'ready') {
          next[k] = { ...next[k], status: 'checking' };
        }
      });
      return next;
    });

    // Check each endpoint individually
    const checkEndpoint = async (key, path) => {
      const start = performance.now();
      try {
        const res = await API.get(path, { timeout: 35000 });
        const latency = Math.round(performance.now() - start);
        if (mountedRef.current && res.status === 200) {
          setEndpoints((prev) => ({
            ...prev,
            [key]: { ...prev[key], status: 'ready', latencyMs: latency },
          }));
          return true;
        }
      } catch (err) {
        console.warn(`Endpoint probe [${key}] failed:`, err);
        if (mountedRef.current) {
          setEndpoints((prev) => ({
            ...prev,
            [key]: { ...prev[key], status: 'error' },
          }));
        }
      }
      return false;
    };

    // Stagger slightly so we don't bombard a waking server at once
    await Promise.all([
      checkEndpoint('health', 'health/'),
      new Promise((r) => setTimeout(r, 150)).then(() => checkEndpoint('projects', 'projects/')),
      new Promise((r) => setTimeout(r, 300)).then(() => checkEndpoint('ats', 'resume-ats-score/')),
    ]);
  }, []);

  // Update stage when all endpoints finish
  useEffect(() => {
    if (stage === 'verifying_endpoints') {
      if (allEndpointsReady) {
        setStage('all_ready');
      }
    }
  }, [allEndpointsReady, stage]);

  // Stage 1: Probe server root to see if container is awake
  const probeServer = useCallback(async (isInitial = false) => {
    try {
      const result = await probeBackendHealth(isInitial ? 3500 : 8000);
      if (!mountedRef.current) return;

      if (result.online) {
        setLatencyMs(result.latencyMs);
        if (serverPollingRef.current) {
          clearInterval(serverPollingRef.current);
          serverPollingRef.current = null;
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        // Transition immediately to Stage 2: Verify Endpoints
        verifyEndpoints();
      } else {
        setStage('waking_server');
      }
    } catch {
      if (mountedRef.current) {
        setStage('waking_server');
      }
    }
  }, [verifyEndpoints]);

  // Initial mount trigger
  useEffect(() => {
    mountedRef.current = true;

    // Start initial server probe
    probeServer(true);

    // If initial probe hasn't resolved within 2.2s, treat as cold start
    const warmupTimeout = setTimeout(() => {
      if (mountedRef.current && stage === 'probing') {
        setStage('waking_server');
      }
    }, 2200);

    return () => {
      mountedRef.current = false;
      clearTimeout(warmupTimeout);
    };
  }, [probeServer]);

  // Stage 1 timers & background polling
  useEffect(() => {
    if (stage === 'waking_server') {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      }

      if (!serverPollingRef.current) {
        serverPollingRef.current = setInterval(() => {
          probeServer(false);
        }, 3500);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (serverPollingRef.current) {
        clearInterval(serverPollingRef.current);
        serverPollingRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (serverPollingRef.current) clearInterval(serverPollingRef.current);
    };
  }, [stage, probeServer]);

  // 2-Minute In-Browser Keep-Alive Heartbeat while user stays on page
  useEffect(() => {
    if (stage !== 'all_ready') return;

    const keepAliveInterval = setInterval(() => {
      probeBackendHealth(5000).catch(() => {});
    }, 120000);

    return () => clearInterval(keepAliveInterval);
  }, [stage]);

  // Calculations
  const estimatedRemaining = Math.max(4, 42 - elapsedSeconds);
  const stage1Progress = Math.min(95, Math.max(10, Math.round((elapsedSeconds / 42) * 100)));
  const stage2Progress = Math.round((completedEndpointsCount / totalEndpointsCount) * 100);

  return (
    <BackendStatusContext.Provider
      value={{
        stage,
        isOnline,
        isWaking,
        isVerifying,
        allEndpointsReady,
        latencyMs,
        elapsedSeconds,
        estimatedRemaining,
        stage1Progress,
        stage2Progress,
        endpoints,
        completedEndpointsCount,
        totalEndpointsCount,
        probeNow: () => probeServer(false),
        verifyEndpoints,
      }}
    >
      {children}
    </BackendStatusContext.Provider>
  );
}

export default BackendStatusContext;
