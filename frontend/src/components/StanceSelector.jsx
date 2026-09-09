import { useStance } from '../context/StanceContext';
import { motion } from 'framer-motion';

export default function StanceSelector({ compact = false }) {
  const { stanceId, setStanceId, allStances } = useStance();

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'rgba(12, 4, 8, 0.85)',
      border: '1px solid var(--glass-border)',
      borderRadius: 100,
      padding: '4px 6px',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    }}>
      {!compact && (
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', paddingLeft: 8, paddingRight: 4, textTransform: 'uppercase' }}>
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
            style={{
              position: 'relative',
              background: active ? `linear-gradient(135deg, ${s.secondary}, ${s.primary})` : 'transparent',
              border: active ? `1px solid ${s.primary}` : '1px solid transparent',
              borderRadius: 50,
              padding: compact ? '4px 10px' : '5px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: active ? '#fff' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 800,
              transition: 'all 0.25s',
              boxShadow: active ? `0 0 14px ${s.glow}` : 'none',
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>{s.kanji}</span>
            <span style={{ display: compact ? 'none' : 'inline', fontSize: '0.72rem' }}>{s.name.replace(' Stance', '')}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
