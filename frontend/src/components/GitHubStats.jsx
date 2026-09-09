import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';

const REPOS = [
  { name: 'ai-cyberpunk-portfolio', desc: 'Full-stack AI portfolio with WebGL, Django REST, chatbot', stars: 12, lang: 'Python',     lcolor: '#3572A5' },
  { name: 'devops-pipeline',        desc: 'Jenkins + Docker + AWS CI/CD automation pipeline',         stars: 8,  lang: 'Dockerfile', lcolor: '#384D54' },
  { name: 'opencv-vision',          desc: 'Real-time computer vision with OpenCV and MATLAB',          stars: 6,  lang: 'Python',     lcolor: '#3572A5' },
  { name: 'django-lms',             desc: 'Learning management system with video streaming',           stars: 5,  lang: 'JavaScript', lcolor: '#f1e05a' },
];

const VP = { once: true, amount: 0.05 };
const FU = (delay) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: VP, transition: { duration: 0.6, delay } });

export default function GitHubStats() {
  const [stats, setStats] = useState({ repos: 15, stars: 31, forks: 8 });
  useEffect(() => { API.get('github/').then(r => { if (r.data) setStats({ repos: r.data.public_repos || 15, stars: r.data.stars_count || 31, forks: r.data.forks_count || 8 }); }).catch(() => {}); }, []);

  return (
    <section id="github" className="section">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP}
        style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 8 }}>
        // MISSION LOGS
      </motion.p>
      <motion.h2 {...FU(0.05)} className="section-title">GitHub <span className="neon-cyan">Stats</span></motion.h2>
      <motion.p {...FU(0.1)} className="section-subtitle">Open source contributions and repositories.</motion.p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 40 }}>
        {[['📦', stats.repos, 'Public Repos', 'var(--cyan)'], ['⭐', stats.stars, 'Total Stars', 'var(--gold)'], ['🍴', stats.forks, 'Total Forks', 'var(--violet)']].map(([icon, val, lbl, col], i) => (
          <motion.div key={lbl} {...FU(0.1 + i * 0.1)} className="glass-card-sm" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: col, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, fontWeight: 600 }}>{lbl}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
        {REPOS.map((r, i) => (
          <motion.a key={r.name} {...FU(0.2 + i * 0.08)}
            href={"https://github.com/SVSS13/" + r.name} target="_blank" rel="noopener noreferrer"
            className="glass-card" style={{ display: 'block', textDecoration: 'none', padding: '22px 24px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--cyan)' }}>&#9906; {r.name}</div>
              <span style={{ fontSize: '0.78rem', color: 'var(--gold)' }}>&#9733; {r.stars}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14 }}>{r.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: r.lcolor, display: 'inline-block', boxShadow: "0 0 6px " + r.lcolor }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.lang}</span>
            </div>
          </motion.a>
        ))}
      </div>

      <motion.div {...FU(0.5)} style={{ textAlign: 'center', marginTop: 40 }}>
        <a href="https://github.com/SVSS13" target="_blank" rel="noopener noreferrer" className="btn-primary">View All Repositories &#8599;</a>
      </motion.div>
    </section>
  );
}
