import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { probeBackendHealth } from '../services/api';

const BackendStatusContext = createContext({
  status: 'probing', // 'probing' | 'waking' | 'online'
  isOnline: false,
  isWaking: false,
  latencyMs: 0,
  elapsedSeconds: 0,
  estimatedRemaining: 35,
  progressPercent: 10,
  probeNow: () => {},
});

export const useBackendStatus = () => useContext(BackendStatusContext);

export function BackendStatusProvider({ children }) {
  const [status, setStatus] = useState('probing');
  const [latencyMs, setLatencyMs] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const timerRef = useRef(null);
  const serverPollingRef = useRef(null);
  const mountedRef = useRef(true);

  const isOnline = status === 'online';
  const isWaking = status === 'waking';

  // Fast probe function - tests /api/health/ in <200ms
  const probeServer = useCallback(async (isInitial = false) => {
    try {
      const result = await probeBackendHealth(isInitial ? 3000 : 7000);
      if (!mountedRef.current) return;

      if (result.online) {
        setStatus('online');
        setLatencyMs(result.latencyMs);
        setElapsedSeconds(0);

        if (serverPollingRef.current) {
          clearInterval(serverPollingRef.current);
          serverPollingRef.current = null;
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

  // Initial mount trigger
  useEffect(() => {
    mountedRef.current = true;
    probeServer(true);

    // If initial probe takes > 2.0s, switch to waking
    const warmupTimeout = setTimeout(() => {
      if (mountedRef.current && status === 'probing') {
        setStatus('waking');
      }
    }, 2000);

    return () => {
      mountedRef.current = false;
      clearTimeout(warmupTimeout);
    };
  }, [probeServer]);

  // Elapsed timer & polling while waking
  useEffect(() => {
    if (status === 'waking') {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      }

      if (!serverPollingRef.current) {
        serverPollingRef.current = setInterval(() => {
          probeServer(false);
        }, 3000);
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
  }, [status, probeServer]);

  // 2-Minute In-Browser Keep-Alive Heartbeat while user stays on page
  useEffect(() => {
    if (status !== 'online') return;

    const keepAliveInterval = setInterval(() => {
      probeBackendHealth(5000).catch(() => {});
    }, 120000);

    return () => clearInterval(keepAliveInterval);
  }, [status]);

  // Calculations
  const estimatedRemaining = Math.max(3, 38 - elapsedSeconds);
  const progressPercent = isOnline
    ? 100
    : Math.min(95, Math.max(12, Math.round((elapsedSeconds / 38) * 100)));

  return (
    <BackendStatusContext.Provider
      value={{
        status,
        isOnline,
        isWaking,
        latencyMs,
        elapsedSeconds,
        estimatedRemaining,
        progressPercent,
        probeNow: () => probeServer(false),
      }}
    >
      {children}
    </BackendStatusContext.Provider>
  );
}

export default BackendStatusContext;
