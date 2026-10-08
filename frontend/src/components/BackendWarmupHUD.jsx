import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBolt, FaCheckCircle, FaRedo, FaTimes, FaServer } from 'react-icons/fa';
import { useBackendStatus } from '../context/BackendStatusContext';
import { useStance } from '../context/StanceContext';

export default function BackendWarmupHUD() {
  const { isOnline, isWaking, latencyMs, elapsedSeconds, estimatedRemaining, probeNow } = useBackendStatus();
  const { stance } = useStance();
  const [dismissed, setDismissed] = useState(false);
  const [showOnlinePill, setShowOnlinePill] = useState(false);

  // When switching to online, display the "Online" pill briefly, then fade out
  useEffect(() => {
    if (isOnline) {
      setShowOnlinePill(true);
      const timer = setTimeout(() => {
        setShowOnlinePill(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  // Calculate estimated progress percentage (0 - 95% during cold boot)
  const progressPercent = Math.min(95, Math.max(8, Math.round((elapsedSeconds / 42) * 100)));

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
        {/* ── State 1: Active Cold-Start Wake-Up Banner ── */}
        {isWaking && !dismissed && (
          <motion.div
            key="waking-hud"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(12, 10, 18, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 170, 0, 0.45)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 170, 0, 0.2)',
              borderRadius: 12,
              padding: '12px 16px',
              maxWidth: 380,
              width: 'calc(100vw - 48px)',
              color: '#fff',
              fontFamily: 'monospace',
            }}
          >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'rgba(255, 170, 0, 0.2)',
                    color: '#ffaa00',
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  >
                    <FaBolt size={12} />
                  </motion.div>
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', color: '#ffaa00' }}>
                  WAKING UP NEURAL CORE
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => probeNow()}
                  title="Force re-check"
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
              Cloud container on Render is spinning up from sleep (~{estimatedRemaining}s remaining).
              AI Chat, live ATS, and API endpoints will unlock automatically.
            </p>

            {/* Segmented Progress Bar */}
            <div
              style={{
                width: '100%',
                height: 5,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <motion.div
                initial={{ width: '8%' }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #ffaa00, #00f0ff)',
                  boxShadow: '0 0 8px #00f0ff',
                }}
              />
            </div>

            {/* Live timer footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 6,
                fontSize: '0.65rem',
                color: 'rgba(255, 255, 255, 0.45)',
              }}
            >
              <span>Elapsed: {elapsedSeconds}s</span>
              <span>Host: Render Cloud (Free Tier)</span>
            </div>
          </motion.div>
        )}

        {/* ── State 2: Online Confirmation Pill (Auto-dismisses in 4.5s) ── */}
        {showOnlinePill && (
          <motion.div
            key="online-hud"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(10, 24, 18, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(0, 255, 136, 0.45)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 255, 136, 0.25)',
              borderRadius: 24,
              padding: '8px 16px',
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
            <span>NEURAL CORE ONLINE</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem' }}>
              • {latencyMs > 0 ? `${latencyMs}ms` : 'Ready'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
