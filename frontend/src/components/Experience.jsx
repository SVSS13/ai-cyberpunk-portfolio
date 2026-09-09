import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EXPERIENCE = [
  {
    role: 'Build & Release Engineer Intern',
    company: 'Tech Startup',
    period: '2025 — Present',
    desc: 'Designed and maintained CI/CD pipelines using Jenkins and Docker. Automated deployment workflows, reducing release time by 40%. Managed AWS EC2 instances and S3 storage.',
    tags: ['Jenkins', 'Docker', 'AWS', 'CI/CD', 'Python'],
    color: '#00d4ff',
    icon: '🚀',
  },
  {
    role: 'AI/ML Research Assistant',
    company: 'DSU Research Lab',
    period: '2024 — 2025',
    desc: 'Developed computer vision models using OpenCV and MATLAB for object detection. Built NLP pipelines for document classification with 88% accuracy.',
    tags: ['Python', 'OpenCV', 'MATLAB', 'ML', 'NLP'],
    color: '#9b59ff',
    icon: '🤖',
  },
  {
    role: 'Full-Stack Developer',
    company: 'Freelance',
    period: '2023 — 2024',
    desc: 'Built and deployed full-stack web applications for clients. Tech stack: React, Django, PostgreSQL. Delivered 5+ production projects on time and within budget.',
    tags: ['React', 'Django', 'PostgreSQL', 'Docker'],
    color: '#ffd700',
    icon: '💻',
  },
];

export default function Experience() {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" className="section" ref={ref}>
      <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 8 }}>
        // BATTLE LOG
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="section-title">
        Work <span className="neon-violet">Experience</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="section-subtitle">
        Every mission that shaped me.
      </motion.p>

      <div style={{ position: 'relative', paddingLeft: 50 }}>
        {/* Timeline line */}
        <motion.div className="timeline-line"
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16,1,0.3,1] }} />

        {EXPERIENCE.map((e, i) => (
          <motion.div key={e.role}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.3 + i * 0.2, ease: [0.16,1,0.3,1] }}
            style={{ position: 'relative', marginBottom: 32 }}>

            {/* Dot on timeline */}
            <div className="timeline-dot" style={{ top: 20, background: `linear-gradient(135deg, ${e.color}, ${e.color}88)`, boxShadow: `0 0 14px ${e.color}88, 0 0 28px ${e.color}44` }} />

            <div className="glass-card" style={{ marginLeft: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, fontSize: '1.3rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${e.color}18`, border: `1px solid ${e.color}33`,
                  }}>{e.icon}</div>
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
