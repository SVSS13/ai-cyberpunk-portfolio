import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStance } from '../context/StanceContext';

const WAYPOINTS = [
  { id: 'hero',       label: 'Hero',       kanji: '壱' },
  { id: 'about',      label: 'About',      kanji: '弐' },
  { id: 'skills',     label: 'Skills',     kanji: '参' },
  { id: 'projects',   label: 'Projects',   kanji: '肆' },
  { id: 'experience', label: 'Experience', kanji: '伍' },
  { id: 'education',  label: 'Education',  kanji: '陸' },
  { id: 'github',     label: 'GitHub',     kanji: '漆' },
  { id: 'resume',     label: 'Resume',     kanji: '捌' },
  { id: 'contact',    label: 'Contact',    kanji: '玖' },
];

export default function TsushimaRightHUD() {
  const { stance } = useStance();
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(pct);

      for (const w of WAYPOINTS) {
        const el = document.getElementById(w.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(w.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Legend Rank Calculation
  let legendRank = "Wandering Samurai";
  let rankColor = "#FFB7C5";
  if (scrollProgress > 0.75) {
    legendRank = "The Ghost of Code (伝説)";
    rankColor = "#FFD700";
  } else if (scrollProgress > 0.45) {
    legendRank = "Champion of Tsushima";
    rankColor = "#FF8DA1";
  } else if (scrollProgress > 0.15) {
    legendRank = "The Crimson Blade";
    rankColor = "#E85D35";
  }

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside
      className="tsushima-right-hud"
      style={{
        position: 'fixed',
        right: 20,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        userSelect: 'none',
      }}
    >
      {/* ── Legend Rank Plaque ── */}
      <div
        style={{
          background: 'rgba(14, 4, 8, 0.90)',
          border: '1px solid var(--glass-border)',
          borderRadius: 14,
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          boxShadow: '0 8px 24px rgba(0,0,0,0.55)',
          backdropFilter: 'blur(14px)',
          maxWidth: 120,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          LEGEND RANK
        </span>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: rankColor, lineHeight: 1.2 }}>
          {legendRank}
        </span>
      </div>

      {/* ── Inscribed Bamboo Waypoint Plaques (Shrine Ema) ── */}
      <div
        style={{
          background: 'rgba(12, 4, 8, 0.85)',
          border: '1px solid var(--glass-border)',
          borderRadius: 50,
          padding: '12px 6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(14px)',
        }}
      >
        {WAYPOINTS.map((w) => {
          const isActive = activeSection === w.id;
          return (
            <motion.button
              key={w.id}
              onClick={() => scrollTo(w.id)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: isActive ? `linear-gradient(135deg, ${stance.secondary}, ${stance.primary})` : 'transparent',
                border: isActive ? `1px solid ${stance.primary}` : '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.68rem',
                fontWeight: 900,
                color: isActive ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isActive ? `0 0 10px ${stance.glow}` : 'none',
              }}
              title={w.label}
            >
              {w.kanji}
            </motion.button>
          );
        })}
      </div>

      {/* ── Kunai Throwing Knife Badge ── */}
      <motion.div
        whileHover={{ rotate: 15, scale: 1.1 }}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'rgba(12, 4, 8, 0.85)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          cursor: 'pointer',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
        }}
        title="Kunai Arsenal"
      >
        🗡️
      </motion.div>

      <style>{`
        @media (max-width: 1100px) {
          .tsushima-right-hud { display: none !important; }
        }
      `}</style>
    </aside>
  );
}
