import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useBrushHover } from '../utils/brushHover';

const PROJECTS = [
  { name: 'AI Cyberpunk Portfolio', desc: 'This very portfolio — Django REST API, React, Three.js WebGL, AI chatbot with DSA search engine.', tags: ['React', 'Django', 'Three.js', 'AI', 'Docker'], color: '#00d4ff', badge: 'FEATURED', github: 'https://github.com/SVSS13/ai-cyberpunk-portfolio' },
  { name: 'AI DSA Chatbot',         desc: 'Conversational AI with custom DSA search, PDF resume parsing, Gemini AI integration.',          tags: ['Python', 'Gemini AI', 'Django', 'NLP'],       color: '#9b59ff', github: 'https://github.com/SVSS13' },
  { name: 'Cloud DevOps Pipeline',  desc: 'Full CI/CD pipeline: Jenkins, Docker Compose, AWS EC2 deployment, automated testing.',          tags: ['Jenkins', 'Docker', 'AWS', 'CI/CD'],          color: '#ffd700', github: 'https://github.com/SVSS13' },
  { name: 'OpenCV Vision System',   desc: 'Real-time computer vision for object detection, face recognition, and gesture control.',        tags: ['Python', 'OpenCV', 'MATLAB', 'ML'],           color: '#00ff88', github: 'https://github.com/SVSS13' },
  { name: 'Full-Stack LMS',         desc: 'Learning management system with video streaming, progress tracking, instructor dashboards.',    tags: ['React', 'Django', 'PostgreSQL', 'Redis'],     color: '#ff4488', github: 'https://github.com/SVSS13' },
  { name: 'Automation Suite',       desc: 'Cross-platform automation: web scraping, data pipelines, scheduled reporting.',                 tags: ['Python', 'Selenium', 'Airflow', 'Linux'],     color: '#ff9900', github: 'https://github.com/SVSS13' },
];

const VP = { once: true, amount: 0.05 };

function ProjectCard({ p, i }) {
  const cardRef = useRef();
  const tiltRef = useRef();
  useBrushHover(cardRef);

  const handleMove = (e) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) scale3d(1.02,1.02,1.02)`;
  };
  const handleLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = 'perspective(700px) rotateY(0) rotateX(0) scale3d(1,1,1)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16,1,0.3,1] }}>
      <div ref={tiltRef} onMouseMove={handleMove} onMouseLeave={handleLeave}
        style={{ transition: 'transform 0.15s ease', willChange: 'transform', height: '100%' }}>
        <div ref={cardRef} className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Shimmer */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3, background: 'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.05) 50%,transparent 60%)', backgroundSize: '200% 100%', animation: 'shimmer-sweep 3.5s linear infinite' }} />
          {/* Color bar */}
          <div style={{ height: 3, background: 'linear-gradient(90deg,' + p.color + ',transparent)', marginBottom: 20, borderRadius: 99, boxShadow: '0 0 12px ' + p.color + '88' }} />
          {p.badge && <span className="badge badge-gold" style={{ marginBottom: 12, alignSelf: 'flex-start', background: p.color + '22', color: p.color, borderColor: p.color + '44' }}>{p.badge}</span>}
          <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: 10, color: p.color }}>{p.name}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, flex: 1, marginBottom: 16 }}>{p.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {p.tags.map(t => <span key={t} className="tag" style={{ fontSize: '0.7rem', color: p.color, borderColor: p.color + '33', background: p.color + '0d' }}>{t}</span>)}
          </div>
          <a href={p.github} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '0.8rem', fontWeight: 700, color: p.color, textDecoration: 'none', zIndex: 10 }}>
            View on GitHub &#8599;
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP}
        style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 8 }}>
        // MISSIONS
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP} transition={{ delay: 0.05 }} className="section-title">
        Featured <span className="neon-cyan">Projects</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP} transition={{ delay: 0.1 }} className="section-subtitle">
        Deployed systems, not side-projects.
      </motion.p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
        {PROJECTS.map((p, i) => <ProjectCard key={p.name} p={p} i={i} />)}
      </div>
    </section>
  );
}
