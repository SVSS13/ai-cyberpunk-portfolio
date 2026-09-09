import { motion } from 'framer-motion';

const EDU = [
  { degree: 'B.E. Computer Engineering', school: 'Dayananda Sagar University', period: '2022 — 2026', grade: 'CGPA: 8.5+', color: '#00d4ff', icon: '🎓', current: true, desc: 'Specialization in AI/ML and Cloud Computing. Core: Data Structures, OS, Networks, ML, Computer Vision.' },
  { degree: 'Pre-University (12th) — PCMB', school: 'Karnataka State Board', period: '2020 — 2022', grade: '88%', color: '#9b59ff', icon: '📚', current: false, desc: 'Physics, Chemistry, Mathematics, Biology.' },
  { degree: 'Secondary School (10th)', school: 'Karnataka State Board', period: '2019 — 2020', grade: '92%', color: '#ffd700', icon: '🏫', current: false, desc: 'Graduated with distinction in Mathematics and Science.' },
];

const VP = { once: true, amount: 0.1 };

export default function Education() {
  return (
    <section id="education" className="section">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP}
        style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 8 }}>
        // TRAINING GROUNDS
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP} transition={{ delay: 0.05 }} className="section-title">
        <span className="neon-gold">Education</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP} transition={{ delay: 0.1 }} className="section-subtitle">
        The foundation of every system.
      </motion.p>

      <div style={{ position: 'relative', paddingLeft: 50 }}>
        <div className="timeline-line" />
        {EDU.map((e, i) => (
          <motion.div key={e.degree}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            style={{ position: 'relative', marginBottom: 28 }}>
            <div className="timeline-dot" style={{ top: 22, background: e.color, boxShadow: `0 0 12px ${e.color}88` }} />
            <div className="glass-card" style={{ marginLeft: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
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
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: e.color }}>{e.grade}</div>
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
