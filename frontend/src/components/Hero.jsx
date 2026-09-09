import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { useTheme } from '../App';
import profilePhoto from '../assets/profile.png';

function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  const pad = n => String(n).padStart(2, '0');
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 800, fontSize: '1.05rem', color: 'var(--sakura)' }}>
      {pad(t.getHours())}:{pad(t.getMinutes())}:{pad(t.getSeconds())}
    </span>
  );
}

const ORBITS = [
  { icon: '⚛', label: 'React',   r: 115, dur: 9,  color: '#FFB7C5' },
  { icon: '🐍', label: 'Python',  r: 150, dur: 13, color: '#D4AF37' },
  { icon: '🐳', label: 'Docker',  r: 130, dur: 11, color: '#E85D35' },
  { icon: '☁',  label: 'AWS',     r: 170, dur: 16, color: '#FF7F50' },
  { icon: '⚙',  label: 'Django',  r: 100, dur: 8,  color: '#7EC8A0' },
];

export default function Hero() {
  const { dark } = useTheme();
  const cardRef = useRef(null);

  const onMouseMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    cardRef.current.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) scale3d(1.03,1.03,1.03)`;
  };

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
  const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } };

  return (
    <section id="hero" style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center',
      padding: '40px 24px', maxWidth: 1100, margin: '0 auto',
    }}>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>

        {/* ── Left: Text ── */}
        <motion.div variants={container} initial="hidden" animate="visible"
          style={{ flex: '1 1 420px', minWidth: 300 }}>

          <motion.p variants={item} style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--sakura)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="status-dot" /> AVAILABLE FOR MISSIONS · 武士道
          </motion.p>

          <motion.h1 variants={item} style={{ fontSize: 'clamp(2.3rem,5.2vw,3.9rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 20 }}>
            HELLO, I'M<br />
            <span className="neon-cyan">SVS SUJAL</span>&nbsp;🌸
          </motion.h1>

          <motion.div variants={item} style={{ fontSize: 'clamp(1.05rem,2.5vw,1.45rem)', fontWeight: 700, marginBottom: 28, color: 'var(--text-secondary)', minHeight: 40 }}>
            <TypeAnimation
              sequence={[
                'Build Engineer', 1800,
                'AI & Cloud Architect', 1800,
                'Full-Stack Developer', 1800,
                'DevOps Master', 1800,
                'Open-Source Craftsman', 1800,
              ]}
              repeat={Infinity}
              style={{ display: 'inline' }}
            />
            <span style={{ animation: 'typewriter-cursor 1s infinite', color: 'var(--sakura)' }}>|</span>
          </motion.div>

          <motion.p variants={item} style={{ color: 'var(--text-muted)', lineHeight: 1.85, maxWidth: 460, marginBottom: 36, fontSize: '0.95rem' }}>
            Forging resilient software at the intersection of AI, Cloud architecture, and automation.
            Crafting scalable solutions with the precision and discipline of the blade.
          </motion.p>

          <motion.div variants={item} style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Initiate Mission →
            </button>
            <button className="btn-ghost" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              Examine Arsenal ↗
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
                  width: 42, height: 42, borderRadius: 12,
                  background: 'rgba(204,34,51,0.12)', border: '1px solid rgba(255,183,197,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--sakura)', fontSize: '1rem', fontWeight: 700, textDecoration: 'none',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(204,34,51,0.25)'; e.currentTarget.style.boxShadow = '0 0 18px rgba(255,183,197,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(204,34,51,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
              >{s.icon}</a>
            ))}
            <div style={{ marginLeft: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>LOCAL TIME</span>
              <Clock />
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right: Holographic Samurai Photo Card ── */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: '0 0 320px', display: 'flex', justifyContent: 'center', position: 'relative' }}>

          {/* Orbit bubbles */}
          {ORBITS.map((o, i) => (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%',
              width: o.r * 2, height: o.r * 2, marginTop: -o.r, marginLeft: -o.r,
              borderRadius: '50%', border: '1px solid rgba(255,183,197,0.08)',
              pointerEvents: 'none',
            }}>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                '--r': `${o.r}px`,
                animation: `orbit ${o.dur}s linear infinite`,
                animationDelay: `${i * -2.2}s`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, marginTop: -16, marginLeft: -16,
                borderRadius: 8, fontSize: '1.05rem',
                background: 'rgba(18, 4, 10, 0.75)',
                border: `1px solid ${o.color}44`,
                color: o.color,
                boxShadow: `0 0 12px ${o.color}33`,
              }}>{o.icon}</div>
            </div>
          ))}

          {/* Holo Card */}
          <div ref={cardRef} onMouseMove={onMouseMove} onMouseLeave={() => { if (cardRef.current) cardRef.current.style.transform = 'perspective(900px) rotateY(0) rotateX(0)'; }} style={{ transition: 'transform 0.18s ease', willChange: 'transform' }}>
            <div className="holo-card" style={{ width: 280, height: 380 }}>
              <div className="holo-border" />
              <img src={profilePhoto} alt="SVS Sujal"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', borderRadius: 20 }} />
              <div className="holo-scan" />
              <div className="holo-lines" />
              <div className="holo-glow" />
              {/* Name badge */}
              <div style={{
                position: 'absolute', bottom: 16, left: 16, right: 16,
                background: 'rgba(12, 4, 8, 0.85)', backdropFilter: 'blur(14px)',
                borderRadius: 12, padding: '10px 14px',
                border: '1px solid rgba(255,183,197,0.25)', zIndex: 20,
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>SVS Sujal</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--sakura)', fontWeight: 600, marginTop: 2 }}>Build Engineer · AI · Cloud</div>
              </div>
            </div>
          </div>

          {/* Ambient Glow behind card */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 320, height: 420, borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(ellipse, rgba(204,34,51,0.22) 0%, rgba(255,183,197,0.12) 45%, transparent 70%)',
            filter: 'blur(35px)',
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
