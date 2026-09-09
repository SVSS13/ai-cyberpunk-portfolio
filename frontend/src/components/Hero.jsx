import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { TypeAnimation } from 'react-type-animation';
import { useTheme } from '../App';
import profilePhoto from '../assets/profile.png';

function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  const pad = n => String(n).padStart(2, '0');
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 800, fontSize: '1.05rem', color: 'var(--cyan)' }}>
      {pad(t.getHours())}:{pad(t.getMinutes())}:{pad(t.getSeconds())}
    </span>
  );
}

const ORBITS = [
  { icon: '⚛', label: 'React',  r: 115, dur: 8,  color: '#61dafb' },
  { icon: '🐍', label: 'Python', r: 150, dur: 12, color: '#ffd700' },
  { icon: '🐳', label: 'Docker', r: 130, dur: 10, color: '#00d4ff' },
  { icon: '☁',  label: 'AWS',   r: 170, dur: 15, color: '#ff9900' },
  { icon: '⚙',  label: 'Django', r: 100, dur: 7, color: '#00ff88' },
];

export default function Hero() {
  const { dark, toggle } = useTheme();
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const onMouseMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top)  / r.height,
    });
  };

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
  const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16,1,0.3,1] } } };

  return (
    <section id="hero" style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center',
      padding: '40px 24px', maxWidth: 1100, margin: '0 auto',
    }}>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>

        {/* ── Left: Text ── */}
        <motion.div variants={container} initial="hidden" animate="visible"
          style={{ flex: '1 1 420px', minWidth: 300 }}>

          <motion.p variants={item} style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="status-dot" /> Available for work
          </motion.p>

          <motion.h1 variants={item} style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 20 }}>
            HELLO, I'M<br />
            <span className="neon-cyan">SVS SUJAL</span>&nbsp;👋
          </motion.h1>

          <motion.div variants={item} style={{ fontSize: 'clamp(1rem,2.5vw,1.4rem)', fontWeight: 700, marginBottom: 28, color: 'var(--text-secondary)', minHeight: 40 }}>
            <TypeAnimation
              sequence={[
                'Build Engineer', 1800,
                'AI Developer', 1800,
                'Cloud Practitioner', 1800,
                'Full-Stack Dev', 1800,
                'DevOps Enthusiast', 1800,
              ]}
              repeat={Infinity}
              style={{ display: 'inline' }}
            />
            <span style={{ animation: 'typewriter-cursor 1s infinite', color: 'var(--cyan)' }}>|</span>
          </motion.div>

          <motion.p variants={item} style={{ color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 440, marginBottom: 36, fontSize: '0.95rem' }}>
            Building scalable systems at the intersection of AI, cloud, and engineering.
            Passionate about turning complex problems into elegant solutions.
          </motion.p>

          <motion.div variants={item} style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Let's Work Together →
            </button>
            <button className="btn-ghost" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              View Projects ↗
            </button>
          </motion.div>

          <motion.div variants={item} style={{ display: 'flex', gap: 20, marginTop: 36, alignItems: 'center' }}>
            {[
              { href: 'https://github.com/SVSS13', icon: '⑂', label: 'GitHub' },
              { href: 'https://www.linkedin.com/in/svss13', icon: 'in', label: 'LinkedIn' },
              { href: 'mailto:svss.officia13@gmail.com', icon: '✉', label: 'Email' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--cyan)', fontSize: '1rem', fontWeight: 700, textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.18)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(0,212,255,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
              >{s.icon}</a>
            ))}
            <div style={{ marginLeft: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>LOCAL TIME</span>
              <Clock />
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right: Holographic Photo Card ── */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16,1,0.3,1] }}
          style={{ flex: '0 0 320px', display: 'flex', justifyContent: 'center', position: 'relative' }}>

          {/* Orbit bubbles */}
          {ORBITS.map((o, i) => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%',
              width: o.r * 2, height: o.r * 2, marginTop: -o.r, marginLeft: -o.r,
              borderRadius: '50%', border: '1px solid rgba(0,212,255,0.07)',
              pointerEvents: 'none',
            }}>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                '--r': `${o.r}px`,
                animation: `orbit ${o.dur}s linear infinite`,
                animationDelay: `${i * -2}s`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, marginTop: -16, marginLeft: -16,
                borderRadius: 8, fontSize: '1.1rem',
                background: `rgba(${parseInt(o.color.slice(1,3),16)},${parseInt(o.color.slice(3,5),16)},${parseInt(o.color.slice(5,7),16)},0.15)`,
                border: `1px solid ${o.color}33`,
                color: o.color,
              }}>{o.icon}</div>
            </div>
          ))}

          {/* Holo card */}
          <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} glareEnable glareMaxOpacity={0.15} glareColor="#00d4ff" glareBorderRadius="20px">
            <div ref={cardRef} onMouseMove={onMouseMove}
              className="holo-card" style={{ width: 280, height: 380, cursor: 'none' }}>
              <div className="holo-border" />
              <img src={profilePhoto} alt="SVS Sujal"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', borderRadius: 20 }} />
              <div className="holo-scan" />
              <div className="holo-lines" />
              <div className="holo-glow" />
              {/* Name badge */}
              <div style={{
                position: 'absolute', bottom: 16, left: 16, right: 16,
                background: 'rgba(3,5,15,0.75)', backdropFilter: 'blur(12px)',
                borderRadius: 12, padding: '10px 14px',
                border: '1px solid rgba(0,212,255,0.2)', zIndex: 20,
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>SVS Sujal</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--cyan)', fontWeight: 600, marginTop: 2 }}>Build Engineer · AI · Cloud</div>
              </div>
            </div>
          </Tilt>

          {/* Glow behind card */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 300, height: 400, borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(ellipse, rgba(0,212,255,0.12) 0%, rgba(155,89,255,0.06) 50%, transparent 70%)',
            filter: 'blur(30px)',
          }} />
        </motion.div>
      </div>

      <style>{`
        @keyframes typewriter-cursor { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @media (max-width: 700px) { #hero > div { flex-direction: column; } }
      `}</style>
    </section>
  );
}
