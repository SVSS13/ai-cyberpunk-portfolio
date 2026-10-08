import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBolt, FaCheck, FaRedo } from 'react-icons/fa';
import { useBackendStatus } from '../context/BackendStatusContext';

export default function BackendStatusCircle() {
  const { isOnline, isWaking, latencyMs, progressPercent, estimatedRemaining, probeNow } = useBackendStatus();
  const [hovered, setHovered] = useState(false);

  // Circular progress math (radius 11, circumference ~ 69.1)
  const radius = 11;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => probeNow()}
        title={isOnline ? `Neural Core Online (${latencyMs}ms)` : `Waking Server (~${estimatedRemaining}s)`}
        style={{
          background: 'rgba(15, 10, 20, 0.65)',
          border: isOnline ? '1px solid rgba(0, 255, 136, 0.35)' : '1px solid rgba(255, 170, 0, 0.4)',
          borderRadius: '50%',
          width: 32,
          height: 32,
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.3s ease',
          boxShadow: isOnline
            ? '0 0 10px rgba(0, 255, 136, 0.2)'
            : '0 0 12px rgba(255, 170, 0, 0.3)',
        }}
      >
        {isWaking ? (
          // ── SVG Circular Progress Ring (Waking) ──
          <svg width={30} height={30} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={15}
              cy={15}
              r={radius}
              stroke="rgba(255, 170, 0, 0.2)"
              strokeWidth={2.5}
              fill="transparent"
            />
            <motion.circle
              cx={15}
              cy={15}
              r={radius}
              stroke="#ffaa00"
              strokeWidth={2.5}
              fill="transparent"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // ── Clean Online Glowing Ring ──
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#00ff88',
              boxShadow: '0 0 8px #00ff88, 0 0 16px rgba(0, 255, 136, 0.5)',
            }}
          />
        )}

        {/* Center Icon for Waking state */}
        {isWaking && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffaa00',
              fontSize: '0.65rem',
            }}
          >
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <FaBolt size={10} />
            </motion.div>
          </div>
        )}
      </button>

      {/* ── Hover Micro-Tooltip ── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              zIndex: 1000,
              background: 'rgba(8, 5, 12, 0.95)',
              backdropFilter: 'blur(12px)',
              border: isOnline ? '1px solid rgba(0, 255, 136, 0.35)' : '1px solid rgba(255, 170, 0, 0.4)',
              borderRadius: 8,
              padding: '6px 10px',
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              color: '#fff',
              pointerEvents: 'none',
              boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
            }}
          >
            {isOnline ? (
              <span style={{ color: '#00ff88', display: 'flex', alignItems: 'center', gap: 5 }}>
                <FaCheck size={9} /> Backend Online ({latencyMs}ms)
              </span>
            ) : (
              <span style={{ color: '#ffaa00', display: 'flex', alignItems: 'center', gap: 5 }}>
                <FaBolt size={9} /> Waking Cloud Server ({progressPercent}% • ~{estimatedRemaining}s)
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
