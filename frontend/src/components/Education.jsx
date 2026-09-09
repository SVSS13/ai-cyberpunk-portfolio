import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EDUCATION = [
  {
    degree: 'B.E. Computer Engineering',
    school: 'Dayananda Sagar University',
    period: '2022 — 2026',
    desc: 'Specialization in AI/ML and Cloud Computing. Core subjects: Data Structures, OS, Computer Networks, Machine Learning, Computer Vision.',
    grade: 'CGPA: 8.5+',
    color: '#00d4ff',
    icon: '🎓',
    current: true,
  },
  {
    degree: 'Pre-University (12th) — PCMB',
    school: 'Karnataka State Board',
    period: '2020 — 2022',
    desc: 'Physics, Chemistry, Mathematics, Biology. Secured 88% aggregate.',
    grade: '88%',
    color: '#9b59ff',
    icon: '📚',
    current: false,
  },
  {
    degree: 'Secondary School (10th)',
    school: 'Karnataka State Board',
    period: '2019 — 2020',
    desc: 'Graduated with distinction in Mathematics and Science.',
    grade: '92%',
    color: '#ffd700',
    icon: '🏫',
    current: false,
  },
];

export default function Education() {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="education" className="section" ref={ref}>
      <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 8 }}>
        // TRAINING GROUNDS
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="section-title">
        <span className="neon-gold">Education</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="section-subtitle">
        The foundation of every system.
      </motion.p>

      <div style={{ position: 'relative', paddingLeft: 50 }}>
        <motion.div className="timeline-line"
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }} />

        {EDUCATION.map((e, i) => (
          <motion.div key={e.degree}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.18 }}
            style={{ position: 'relative', marginBottom: 28 }}>

            <div className="timeline-dot" style={{ top: 22, background: e.color, boxShadow: `0 0 12px ${e.color}88, 0 0 24px ${e.color}44` }} />

            <div className="glass-card" style={{ marginLeft: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${e.color}18`, border: `1px solid ${e.color}33` }}>{e.icon}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ fontWeight: 800, fontSize: '0.98rem', color: e.color }}>{e.degree}</h3>
                      {e.current && <span className="badge badge-green" style={{ fontSize: '0.62rem' }}>CURRENT</span>}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{e.school}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{e.period}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: e.color, marginTop: 2 }}>{e.grade}</div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{e.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
