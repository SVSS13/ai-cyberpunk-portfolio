import { useRef } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useBrushHover } from '../utils/brushHover';

const PROJECTS = [
  { name: 'AI Cyberpunk Portfolio', desc: 'This very portfolio — Django REST API, React, Three.js WebGL, AI chatbot with DSA search engine.', tags: ['React', 'Django', 'Three.js', 'AI', 'Docker'], color: '#00d4ff', badge: 'FEATURED', github: 'https://github.com/SVSS13/ai-cyberpunk-portfolio' },
  { name: 'AI DSA Chatbot',         desc: 'Conversational AI with custom DSA search engine, PDF resume parsing, and Gemini AI integration.', tags: ['Python', 'Gemini AI', 'Django', 'NLP'], color: '#9b59ff', github: 'https://github.com/SVSS13' },
  { name: 'Cloud DevOps Pipeline',  desc: 'Full CI/CD pipeline with Jenkins, Docker Compose, AWS EC2 deployment, and automated testing.', tags: ['Jenkins', 'Docker', 'AWS', 'CI/CD'], color: '#ffd700', github: 'https://github.com/SVSS13' },
  { name: 'OpenCV Vision System',   desc: 'Real-time computer vision for object detection, face recognition, and gesture control.', tags: ['Python', 'OpenCV', 'MATLAB', 'ML'], color: '#00ff88', github: 'https://github.com/SVSS13' },
  { name: 'Full-Stack LMS',         desc: 'Learning management system with video streaming, progress tracking, and instructor dashboards.', tags: ['React', 'Django', 'PostgreSQL', 'Redis'], color: '#ff4488', github: 'https://github.com/SVSS13' },
  { name: 'Automation Suite',       desc: 'Cross-platform automation framework for web scraping, data pipelines, and scheduled reporting.', tags: ['Python', 'Selenium', 'Airflow', 'Linux'], color: '#ff9900', github: 'https://github.com/SVSS13' },
];

const VP = { once: true, amount: 0.05 };

function ProjectCard({ p, i }) {
  const cardRef = useRef();
  useBrushHover(cardRef);
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP} transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16,1,0.3,1] }}>
      <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.1} glareBorderRadius="20px" style={{ height: '100%' }}>
        <div ref={cardRef} className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3, background: 'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.05) 50%,transparent 60%)', backgroundSize: '200% 100%', animation: 'shimmer-sweep 3.5s linear infinite' }} />
          <div style={{ height: 3, background: 'linear-gradient(90deg,' + p.color + ',transparent)', marginBottom: 20, borderRadius: 99, boxShadow: '0 0 12px ' + p.color + '88' }} />
          {p.badge && <span className="badge badge-gold" style={{ marginBottom: 12, alignSelf: 'flex-start', background: p.color + '22', color: p.color, borderColor: p.color + '44' }}>{p.badge}</span>}
          <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: 10, color: p.color }}>{p.name}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, flex: 1, marginBottom: 16 }}>{p.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {p.tags.map(t => <span key={t} className="tag" style={{ fontSize: '0.7rem', color: p.color, borderColor: p.color + '33', background: p.color + '0d' }}>{t}</span>)}
          </div>
          <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', fontWeight: 700, color: p.color, textDecoration: 'none', zIndex: 10 }}>View on GitHub &#8599;</a>
        </div>
      </Tilt>
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
