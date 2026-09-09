import { useStance } from '../context/StanceContext';
import { motion } from 'framer-motion';

export default function StanceSelector({ compact = false }) {
  const { stanceId, setStanceId, allStances } = useStance();

  return (
    <div
      className="stance-selector-bar"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: 'rgba(12, 4, 8, 0.88)',
        border: '1px solid var(--glass-border)',
        borderRadius: 100,
        padding: '3px 5px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      {!compact && (
        <span
          className="stance-title-text"
          style={{
            fontSize: '0.62rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            paddingLeft: 6,
            paddingRight: 2,
            textTransform: 'uppercase',
          }}
        >
          STANCE
        </span>
      )}
      {Object.values(allStances).map((s) => {
        const active = stanceId === s.id;
        return (
          <motion.button
            key={s.id}
            onClick={() => setStanceId(s.id)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="stance-item-btn"
            style={{
              position: 'relative',
              background: active ? `linear-gradient(135deg, ${s.secondary}, ${s.primary})` : 'transparent',
              border: active ? `1px solid ${s.primary}` : '1px solid transparent',
              borderRadius: 50,
              padding: compact ? '3px 8px' : '4px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              color: active ? '#fff' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 800,
              transition: 'all 0.25s',
              boxShadow: active ? `0 0 14px ${s.glow}` : 'none',
            }}
          >
            <span style={{ fontSize: '0.82rem' }}>{s.kanji}</span>
            <span className="stance-btn-label" style={{ display: compact ? 'none' : 'inline', fontSize: '0.70rem' }}>
              {s.name.replace(' Stance', '')}
            </span>
          </motion.button>
        );
      })}

      <style>{`
        @media (max-width: 560px) {
          .stance-title-text { display: none !important; }
          .stance-btn-label { display: none !important; }
          .stance-item-btn { padding: 4px 8px !important; }
        }
      `}</style>
    </div>
  );
}
