import { motion } from 'framer-motion';

const EXP = [
  {
    role: 'Build & Release Engineer Intern', company: 'Tech Startup', period: '2025 — Present',
    desc: 'Designed and maintained CI/CD pipelines using Jenkins and Docker. Automated deployment workflows, reducing release time by 40%. Managed AWS EC2 and S3.',
    tags: ['Jenkins', 'Docker', 'AWS', 'CI/CD', 'Python'], color: '#00d4ff', icon: '🚀',
  },
  {
    role: 'AI/ML Research Assistant', company: 'DSU Research Lab', period: '2024 — 2025',
    desc: 'Developed computer vision models using OpenCV and MATLAB for object detection. Built NLP pipelines for document classification with 88% accuracy.',
    tags: ['Python', 'OpenCV', 'MATLAB', 'ML', 'NLP'], color: '#9b59ff', icon: '🤖',
  },
  {
    role: 'Full-Stack Developer', company: 'Freelance', period: '2023 — 2024',
    desc: 'Built and deployed full-stack web applications. Tech stack: React, Django, PostgreSQL. Delivered 5+ production projects on time and within budget.',
    tags: ['React', 'Django', 'PostgreSQL', 'Docker'], color: '#ffd700', icon: '💻',
  },
];

const VP = { once: true, amount: 0.1 };

export default function Experience() {
  return (
    <section id="experience" className="section">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP}
        style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 8 }}>
        // BATTLE LOG
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP} transition={{ delay: 0.05 }} className="section-title">
        Work <span className="neon-violet">Experience</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP} transition={{ delay: 0.1 }} className="section-subtitle">
        Every mission that shaped me.
      </motion.p>

      <div style={{ position: 'relative', paddingLeft: 50 }}>
        <div className="timeline-line" />
        {EXP.map((e, i) => (
          <motion.div key={e.role}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', marginBottom: 32 }}>
            <div className="timeline-dot" style={{ top: 22, background: `linear-gradient(135deg,${e.color},${e.color}88)`, boxShadow: `0 0 14px ${e.color}88` }} />
            <div className="glass-card" style={{ marginLeft: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${e.color}18`, border: `1px solid ${e.color}33` }}>{e.icon}</div>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: '1rem', color: e.color }}>{e.role}</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{e.company}</div>
                  </div>
                </div>
                <span className="badge badge-cyan" style={{ background: `${e.color}18`, color: e.color, borderColor: `${e.color}44` }}>{e.period}</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 14 }}>{e.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {e.tags.map(t => <span key={t} className="tag" style={{ color: e.color, borderColor: `${e.color}33`, background: `${e.color}0d` }}>{t}</span>)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
