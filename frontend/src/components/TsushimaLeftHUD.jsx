import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStance } from '../context/StanceContext';

export default function TsushimaLeftHUD() {
  const { stance } = useStance();
  const [scrollPct, setScrollPct] = useState(0);
  const [ghostMode, setGhostMode] = useState(false);
  const [resolveFlash, setResolveFlash] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollPct(Math.min(1, Math.max(0, pct)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const totalOrbs = 5;
  const activeOrbs = Math.min(totalOrbs, Math.floor(scrollPct * totalOrbs) + 1);

  const handleResolveClick = () => {
    setResolveFlash(true);
    setTimeout(() => setResolveFlash(false), 600);
  };

  const handleGhostStanceClick = () => {
    setGhostMode(true);
    document.body.classList.add('ghost-stance-active');
    setTimeout(() => {
      setGhostMode(false);
      document.body.classList.remove('ghost-stance-active');
    }, 3500);
  };

  return (
    <>
      <aside
        className="tsushima-left-hud"
        style={{
          position: 'fixed',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          userSelect: 'none',
        }}
      >
        {/* ── Sakai Clan War Banner (Sashimono) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {/* Bamboo Pole Top Cap */}
          <div style={{ width: 6, height: 16, background: '#D4AF37', borderRadius: '4px 4px 0 0', boxShadow: '0 0 8px #D4AF37' }} />
          {/* Crossbeam */}
          <div style={{ width: 44, height: 4, background: '#2B070B', border: '1px solid #D4AF37', borderRadius: 2 }} />

          {/* Flowing Banner Fabric */}
          <motion.div
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 36,
              background: 'linear-gradient(180deg, rgba(20,4,8,0.92) 0%, rgba(43,7,11,0.92) 100%)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '0 0 4px 4px',
              padding: '10px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Sakai Crest Motif */}
            <div style={{ fontSize: '1rem', color: '#D4AF37', textShadow: '0 0 8px #D4AF37' }}>
              ⛩️
            </div>

            {/* Kanji Standard: 風 林 火 山 (Wind, Forest, Fire, Mountain) */}
            {['風', '林', '火', '山'].map((kanji, idx) => (
              <span
                key={kanji}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  color: idx % 2 === 0 ? 'var(--sakura)' : '#F5E6D3',
                  textShadow: '0 0 6px rgba(255,183,197,0.4)',
                  letterSpacing: '0.05em',
                }}
              >
                {kanji}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── 5 Golden Resolve Orbs (気合) ── */}
        <div
          onClick={handleResolveClick}
          title="Resolve Orbs (Fill as you journey)"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(12, 4, 8, 0.85)',
            border: '1px solid var(--glass-border)',
            borderRadius: 50,
            padding: '10px 6px',
            backdropFilter: 'blur(14px)',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.1em' }}>
            KIAI
          </span>
          {[0, 1, 2, 3, 4].map((i) => {
            const isFilled = i < activeOrbs;
            return (
              <motion.div
                key={i}
                animate={isFilled ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: isFilled ? 'linear-gradient(135deg, #FFE57F, #D4AF37)' : 'rgba(255,255,255,0.08)',
                  border: isFilled ? '1px solid #FFE57F' : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: isFilled ? '0 0 10px #D4AF37, 0 0 20px rgba(212,175,55,0.4)' : 'none',
                  transition: 'all 0.3s',
                }}
              />
            );
          })}
        </div>

        {/* ── Ghost Stance Trigger Gauge ── */}
        <motion.button
          onClick={handleGhostStanceClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: scrollPct > 0.6 ? 'linear-gradient(135deg, #CC2233, #8B0000)' : 'rgba(12, 4, 8, 0.85)',
            border: scrollPct > 0.6 ? '1px solid #FF4466' : '1px solid var(--glass-border)',
            borderRadius: 50,
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: scrollPct > 0.6 ? '0 0 18px rgba(204,34,51,0.7)' : 'none',
            backdropFilter: 'blur(14px)',
            transition: 'all 0.3s',
          }}
          title="Ghost Stance Mode"
        >
          冥
        </motion.button>
      </aside>

      {/* Screen Resolve Pulse Overlay */}
      <AnimatePresence>
        {resolveFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'radial-gradient(circle, #D4AF37 0%, transparent 75%)',
              pointerEvents: 'none',
              zIndex: 9990,
            }}
          />
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1100px) {
          .tsushima-left-hud { display: none !important; }
        }
        body.ghost-stance-active {
          filter: contrast(1.25) saturate(0.35) brightness(0.95);
          transition: filter 0.35s ease;
        }
      `}</style>
    </>
  );
}
