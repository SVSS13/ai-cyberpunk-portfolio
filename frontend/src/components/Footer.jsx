import { motion } from 'framer-motion';

export default function Footer() {
  const year = new Date().getFullYear();
  const LINKS = [
    { href: 'https://github.com/SVSS13',           icon: '⑂',  label: 'GitHub'   },
    { href: 'https://www.linkedin.com/in/svss13',  icon: 'in', label: 'LinkedIn' },
    { href: 'mailto:svss.officia13@gmail.com',     icon: '✉',  label: 'Email'    },
  ];
  return (
    <footer style={{ position: 'relative', zIndex: 1, padding: '48px 24px 32px', textAlign: 'center' }}>
      <div className="neon-divider" style={{ maxWidth: 1100, margin: '0 auto 40px' }} />
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontWeight: 900, fontSize: '1.6rem', letterSpacing: '-0.04em', background: 'linear-gradient(135deg,#FFB7C5,#CC2233,#D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 10 }}>SVS.</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 24 }}>Build Engineer · AI Developer · Cloud Practitioner</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 28 }}>
          {LINKS.map(s => (
            <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.12, y: -2 }}
              style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(204,34,51,0.1)', border: '1px solid rgba(204,34,51,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sakura)', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}>
              {s.icon}
            </motion.a>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20, color: 'var(--text-muted)', fontSize: '0.7rem' }}>
          {'✿ ❀ ❁ ✿ ❀ ❁ ✿ ❀'.split(' ').map((s, i) => (
            <span key={i} style={{ animation: 'pulse-dot ' + (1.5 + i * 0.2) + 's infinite', animationDelay: (i * 0.15) + 's' }}>{s}</span>
          ))}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>© {year} SVS Sujal. Built with the spirit of the Ghost.</p>
        <p style={{ color: 'rgba(240,185,160,0.2)', fontSize: '0.7rem', marginTop: 8 }}>React · Django · Three.js · WebGL · AWS</p>
      </div>
    </footer>
  );
}
