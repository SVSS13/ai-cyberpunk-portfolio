import { motion } from 'framer-motion';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ position: 'relative', zIndex: 1, padding: '48px 24px 32px', textAlign: 'center' }}>
      <div className="neon-divider" style={{ maxWidth: 1100, margin: '0 auto 40px' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Logo */}
        <div style={{ fontWeight: 900, fontSize: '1.6rem', letterSpacing: '-0.04em', background: 'linear-gradient(135deg,#00d4ff,#9b59ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 }}>
          SVS.
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 24 }}>
          Build Engineer · AI Developer · Cloud Practitioner
        </p>

        {/* Social icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
          {[
            { href: 'https://github.com/SVSS13',             icon: '⑂', label: 'GitHub' },
            { href: 'https://www.linkedin.com/in/svss13',    icon: 'in', label: 'LinkedIn' },
            { href: 'mailto:svss.officia13@gmail.com',       icon: '✉', label: 'Email' },
          ].map(s => (
            <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, y: -2 }}
              style={{
                width: 42, height: 42, borderRadius: 12,
                background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--cyan)', fontSize: '1rem', fontWeight: 700, textDecoration: 'none',
                transition: 'all 0.2s',
              }}>
              {s.icon}
            </motion.a>
          ))}
        </div>

        {/* Mini stars animation */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24, color: 'var(--text-muted)', fontSize: '0.7rem' }}>
          {'★ ✦ ⋆ ✵ ★ ✦ ⋆ ✵ ★'.split(' ').map((s, i) => (
            <span key={i} style={{ animation: `pulse-dot ${1.5 + i * 0.2}s infinite`, animationDelay: `${i * 0.15}s` }}>{s}</span>
          ))}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          © {year} SVS Sujal. Built from the stars, deployed to the cloud.
        </p>
        <p style={{ color: 'rgba(200,210,255,0.25)', fontSize: '0.7rem', marginTop: 8 }}>
          React · Django · Three.js · WebGL · AWS
        </p>
      </div>
    </footer>
  );
}
