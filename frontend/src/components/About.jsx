import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import Tilt from 'react-parallax-tilt';
import { useBrushHover } from '../utils/brushHover';
import profilePhoto from '../assets/profile.png';

const STATS = [
  { value: 3, suffix: '+', label: 'Years Experience' },
  { value: 20, suffix: '+', label: 'Projects Built' },
  { value: 15, suffix: '+', label: 'Technologies' },
  { value: 100, suffix: '%', label: 'Passion' },
];

const INTERESTS = ['AI & Machine Learning', 'Cloud Architecture', 'DevOps Automation', 'Open Source', 'Competitive Programming', 'System Design'];

function BrushCard({ children, style }) {
  const ref = useRef();
  useBrushHover(ref);
  return (
    <div ref={ref} className="glass-card" style={style}>{children}</div>
  );
}

export default function About() {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const fadeIn = (i = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16,1,0.3,1] },
  });

  return (
    <section id="about" className="section" ref={ref}>
      <motion.p {...fadeIn(0)} style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 8 }}>
        // WHO AM I
      </motion.p>
      <motion.h2 {...fadeIn(0.5)} className="section-title">
        About <span className="neon-cyan">Me</span>
      </motion.h2>
      <motion.p {...fadeIn(1)} className="section-subtitle">
        Engineering the future, one commit at a time.
      </motion.p>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
        {STATS.map((s, i) => (
          <motion.div key={s.label} {...fadeIn(i * 0.15)} className="glass-card-sm"
            style={{ textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--cyan)', lineHeight: 1 }}>
              {inView ? <CountUp end={s.value} duration={2} delay={i * 0.2} suffix={s.suffix} /> : '0'+s.suffix}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, fontWeight: 600 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 24, alignItems: 'start' }}>
        {/* Photo */}
        <motion.div {...fadeIn(2)}>
          <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.1} glareBorderRadius="20px">
            <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 0 30px rgba(0,212,255,0.08)' }}>
              <img src={profilePhoto} alt="SVS Sujal" style={{ width: '100%', display: 'block', objectFit: 'cover', aspectRatio: '3/4', objectPosition: 'center top' }} />
            </div>
          </Tilt>
        </motion.div>

        {/* Bio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <BrushCard>
            <h3 style={{ fontWeight: 800, marginBottom: 16, color: 'var(--cyan)' }}>Background</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Final-year B.E. Computer Engineering student at DSU, passionate about building systems that scale.
              I work at the intersection of AI, cloud, and full-stack development — translating complex requirements
              into production-grade solutions.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: 12 }}>
              My toolkit spans Python/Django backends, React frontends, Docker containerization, CI/CD with Jenkins,
              and AWS cloud deployments. I believe in automation-first engineering and clean, maintainable code.
            </p>
          </BrushCard>

          <BrushCard>
            <h3 style={{ fontWeight: 800, marginBottom: 14, color: 'var(--violet)' }}>Interests</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {INTERESTS.map(i => <span key={i} className="tag">{i}</span>)}
            </div>
          </BrushCard>

          <BrushCard>
            <h3 style={{ fontWeight: 800, marginBottom: 14, color: 'var(--gold)' }}>Quick Facts</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['📍', 'Location', 'Dayananda Sagar University'],
                ['🎓', 'Degree', 'B.E. Computer Engineering'],
                ['💼', 'Role', 'Build Engineer & AI Dev'],
                ['⚡', 'Focus', 'AI · Cloud · DevOps'],
              ].map(([icon, k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{k}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: 600 }}>{v}</div>
                  </div>
                </div>
              ))}
            </div>
          </BrushCard>
        </div>
      </div>

      <style>{`@media(max-width:700px){#about .section > div:last-child{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
