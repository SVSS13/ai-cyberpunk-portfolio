import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const SKILLS = [
  { icon: '🐍', label: 'Python',     color: '#ffd700', bg: 'rgba(255,215,0,0.12)'    },
  { icon: '⚛',  label: 'React',      color: '#61dafb', bg: 'rgba(97,218,251,0.12)'   },
  { icon: '🦄', label: 'Django',     color: '#00ff88', bg: 'rgba(0,255,136,0.12)'    },
  { icon: '🐳', label: 'Docker',     color: '#00d4ff', bg: 'rgba(0,212,255,0.12)'    },
  { icon: '☁',  label: 'AWS',        color: '#ff9900', bg: 'rgba(255,153,0,0.12)'    },
  { icon: '⚙',  label: 'Jenkins',    color: '#d24939', bg: 'rgba(210,73,57,0.12)'    },
  { icon: '🤖', label: 'AI / ML',    color: '#9b59ff', bg: 'rgba(155,89,255,0.12)'   },
  { icon: '👁',  label: 'OpenCV',    color: '#00ff88', bg: 'rgba(0,255,136,0.12)'    },
  { icon: '🐧', label: 'Linux',      color: '#ffd700', bg: 'rgba(255,215,0,0.12)'    },
  { icon: '📐', label: 'MATLAB',     color: '#e16737', bg: 'rgba(225,103,55,0.12)'   },
  { icon: '🗄',  label: 'PostgreSQL', color: '#336791', bg: 'rgba(51,103,145,0.15)'  },
  { icon: '🔀', label: 'Git',        color: '#f05032', bg: 'rgba(240,80,50,0.12)'    },
  { icon: '☸',  label: 'Kubernetes', color: '#326ce5', bg: 'rgba(50,108,229,0.12)'   },
  { icon: '⚡', label: 'FastAPI',    color: '#009688', bg: 'rgba(0,150,136,0.12)'    },
];

const PROFICIENCY = [
  { label: 'Python & Django',  pct: 90, color: '#ffd700'  },
  { label: 'React & JS',       pct: 82, color: '#61dafb'  },
  { label: 'Docker & DevOps',  pct: 78, color: '#00d4ff'  },
  { label: 'AWS Cloud',        pct: 72, color: '#ff9900'  },
  { label: 'AI / ML',          pct: 75, color: '#9b59ff'  },
  { label: 'Linux & Shell',    pct: 85, color: '#00ff88'  },
];

export default function Skills() {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="section" ref={ref}>
      <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 8 }}>
        // ARSENAL
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }} className="section-title">
        Technical <span className="neon-violet">Skills</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="section-subtitle">
        My weapon of choice for every mission.
      </motion.p>

      {/* Hex grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 4px', justifyContent: 'center', marginBottom: 60 }}>
        {SKILLS.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
            animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.055, type: 'spring', stiffness: 200, damping: 18 }}
            className="hex-wrap">
            <div className="hex" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 70 }}>{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Proficiency bars */}
      <div className="glass-card" style={{ maxWidth: 600, margin: '0 auto' }}>
        <h3 style={{ fontWeight: 800, marginBottom: 24, color: 'var(--text)' }}>Proficiency Levels</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {PROFICIENCY.map((p, i) => (
            <div key={p.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>{p.label}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: p.color }}>{p.pct}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${p.pct}%` } : {}}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.16,1,0.3,1] }}
                  style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${p.color}aa, ${p.color})`, boxShadow: `0 0 8px ${p.color}66` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
