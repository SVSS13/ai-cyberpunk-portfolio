import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBolt, FaCheckCircle, FaSpinner, FaTimes, FaRedo, FaServer, FaCheck } from 'react-icons/fa';
import { useBackendStatus } from '../context/BackendStatusContext';

export default function BackendWarmupHUD() {
  const {
    stage,
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
    probeNow,
    verifyEndpoints,
  } = useBackendStatus();

  const [dismissed, setDismissed] = useState(false);
  const [showCompletionPill, setShowCompletionPill] = useState(false);

  // When all endpoints are ready, show completion pill for 3.8s then fade out permanently
  useEffect(() => {
    if (allEndpointsReady) {
      setShowCompletionPill(true);
      const timer = setTimeout(() => {
        setShowCompletionPill(false);
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [allEndpointsReady]);

  // Determine if the full HUD should stay rendered
  const shouldRenderHUD = (isWaking || isVerifying || (!allEndpointsReady && stage !== 'probing')) && !dismissed;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9990,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      <AnimatePresence>
        {/* ── Main HUD: Stays rendered unless ALL endpoints are loaded ── */}
        {shouldRenderHUD && (
          <motion.div
            key="warmup-verification-hud"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(12, 10, 20, 0.94)',
              backdropFilter: 'blur(16px)',
              border: isVerifying ? '1px solid rgba(0, 240, 255, 0.45)' : '1px solid rgba(255, 170, 0, 0.45)',
              boxShadow: isVerifying
                ? '0 12px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(0, 240, 255, 0.2)'
                : '0 12px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(255, 170, 0, 0.2)',
              borderRadius: 14,
              padding: '14px 18px',
              maxWidth: 400,
              width: 'calc(100vw - 48px)',
              color: '#fff',
              fontFamily: 'monospace',
            }}
          >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: isVerifying ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 170, 0, 0.2)',
                    color: isVerifying ? '#00f0ff' : '#ffaa00',
                  }}
                >
                  {isVerifying ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
                    >
                      <FaServer size={12} />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    >
                      <FaBolt size={12} />
                    </motion.div>
                  )}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: isVerifying ? '#00f0ff' : '#ffaa00',
                  }}
                >
                  {isVerifying
                    ? 'STAGE 2: VERIFYING ENDPOINTS'
                    : 'STAGE 1: WAKING UP CLOUD SERVER'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => (isVerifying ? verifyEndpoints() : probeNow())}
                  title="Retry Probe"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  <FaRedo size={11} />
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  title="Dismiss HUD"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  <FaTimes size={12} />
                </button>
              </div>
            </div>

            {/* Subtext description */}
            <p style={{ margin: '0 0 10px 0', fontSize: '0.72rem', color: '#ccc', lineHeight: 1.4 }}>
              {isVerifying
                ? `Cloud server active! Probing 3 core endpoints (${completedEndpointsCount}/${totalEndpointsCount} ready)...`
                : `Render cloud container spinning up from sleep (~${estimatedRemaining}s remaining). Stage 2 endpoint verification will follow.`}
            </p>

            {/* ── Progress Bar 1 (Server Cold Boot) ── */}
            <div style={{ marginBottom: isVerifying ? 10 : 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'rgba(255,255,255,0.6)', marginBottom: 3 }}>
                <span>Server Container</span>
                <span>{isVerifying ? '100% (Online)' : `${stage1Progress}% (~${estimatedRemaining}s)`}</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 5,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: '10%' }}
                  animate={{ width: isVerifying ? '100%' : `${stage1Progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: isVerifying ? '#00ff88' : 'linear-gradient(90deg, #ffaa00, #ff7700)',
                    boxShadow: isVerifying ? '0 0 8px #00ff88' : '0 0 8px #ffaa00',
                  }}
                />
              </div>
            </div>

            {/* ── Progress Bar 2 (Endpoints Verification) ── */}
            {isVerifying && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'rgba(255,255,255,0.6)', marginBottom: 3 }}>
                  <span>Subsystem Endpoints</span>
                  <span>{stage2Progress}% ({completedEndpointsCount}/{totalEndpointsCount} loaded)</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: 5,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${stage2Progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #00f0ff, #00ff88)',
                      boxShadow: '0 0 8px #00f0ff',
                    }}
                  />
                </div>
              </div>
            )}

            {/* ── Endpoints Live Checklist ── */}
            {isVerifying && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  background: 'rgba(0, 0, 0, 0.35)',
                  padding: '8px 10px',
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                {Object.values(endpoints).map((ep) => {
                  const isReady = ep.status === 'ready';
                  const isChecking = ep.status === 'checking';
                  return (
                    <div
                      key={ep.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.68rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {isReady ? (
                          <FaCheck size={10} color="#00ff88" />
                        ) : isChecking ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          >
                            <FaSpinner size={10} color="#00f0ff" />
                          </motion.div>
                        ) : (
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                        )}
                        <span style={{ color: isReady ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                          {ep.label}
                        </span>
                      </div>
                      <span style={{ color: isReady ? '#00ff88' : '#00f0ff', fontSize: '0.64rem' }}>
                        {isReady ? `${ep.latencyMs}ms ✓` : isChecking ? 'verifying...' : 'queued'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.64rem',
                color: 'rgba(255, 255, 255, 0.45)',
              }}
            >
              <span>Elapsed: {elapsedSeconds}s</span>
              <span>{isVerifying ? 'Verifying Services...' : 'Render Free Tier'}</span>
            </div>
          </motion.div>
        )}

        {/* ── Completion Pill: Appears once 100% of endpoints are verified, then unmounts ── */}
        {showCompletionPill && (
          <motion.div
            key="all-ready-hud"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(10, 26, 18, 0.94)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(0, 255, 136, 0.55)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 255, 136, 0.3)',
              borderRadius: 24,
              padding: '8px 18px',
              color: '#00ff88',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              letterSpacing: '0.05em',
            }}
          >
            <FaCheckCircle size={14} color="#00ff88" />
            <span>ALL SYSTEMS VERIFIED & ONLINE (100%)</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem' }}>
              • {latencyMs > 0 ? `${latencyMs}ms` : 'Ready'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
