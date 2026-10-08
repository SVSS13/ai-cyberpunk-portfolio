import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { probeBackendHealth } from '../services/api';

const BackendStatusContext = createContext({
  status: 'probing', // 'probing' | 'waking' | 'online' | 'offline'
  isOnline: false,
  isWaking: false,
  latencyMs: 0,
  elapsedSeconds: 0,
  estimatedRemaining: 40,
  probeNow: () => {},
});

export const useBackendStatus = () => useContext(BackendStatusContext);

export function BackendStatusProvider({ children }) {
  const [status, setStatus] = useState('probing');
  const [latencyMs, setLatencyMs] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const isOnline = status === 'online';
  const isWaking = status === 'waking';

  const timerRef = useRef(null);
  const pollingRef = useRef(null);
  const mountedRef = useRef(true);

  // Probe function
  const probe = useCallback(async (isInitial = false) => {
    try {
      const result = await probeBackendHealth(isInitial ? 4000 : 8000);
      if (!mountedRef.current) return;

      if (result.online) {
        setStatus('online');
        setLatencyMs(result.latencyMs);
        setElapsedSeconds(0);
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        setStatus('waking');
      }
    } catch {
      if (mountedRef.current) {
        setStatus('waking');
      }
    }
  }, []);

  // Lifecycle & Polling
  useEffect(() => {
    mountedRef.current = true;

    // Start initial probe
    probe(true);

    // If still probing after 2.5s, assume waking up / cold start
    const warmupTimeout = setTimeout(() => {
      if (mountedRef.current && status === 'probing') {
        setStatus('waking');
      }
    }, 2500);

    return () => {
      mountedRef.current = false;
      clearTimeout(warmupTimeout);
    };
  }, [probe]);

  // Handle elapsed seconds and background polling when waking
  useEffect(() => {
    if (status === 'waking') {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      }

      if (!pollingRef.current) {
        pollingRef.current = setInterval(() => {
          probe(false);
        }, 3500);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [status, probe]);

  // Active Keep-Alive in browser while user is viewing the page (pings every 2 minutes)
  useEffect(() => {
    if (status !== 'online') return;

    const keepAliveInterval = setInterval(() => {
      probeBackendHealth(5000).catch(() => {});
    }, 120000); // 2 minutes

    return () => clearInterval(keepAliveInterval);
  }, [status]);

  // Estimated remaining seconds calculation (typical Render cold start is ~40-45s)
  const estimatedRemaining = Math.max(5, 42 - elapsedSeconds);

  return (
    <BackendStatusContext.Provider
      value={{
        status,
        isOnline,
        isWaking,
        latencyMs,
        elapsedSeconds,
        estimatedRemaining,
        probeNow: () => probe(false),
      }}
    >
      {children}
    </BackendStatusContext.Provider>
  );
}

export default BackendStatusContext;
