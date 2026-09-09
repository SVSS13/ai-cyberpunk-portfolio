import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StanceSelector from './StanceSelector';

const LINKS = [
  { id: 'about',      label: 'About'      },
  { id: 'skills',     label: 'Skills'     },
  { id: 'projects',   label: 'Projects'   },
  { id: 'experience', label: 'Experience' },
  { id: 'github',     label: 'GitHub'     },
  { id: 'contact',    label: 'Contact'    },
];

export default function Navbar() {
  const [active,   setActive]   = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const cur = LINKS.map(l => l.id).find(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= 100 && r.bottom >= 100;
      }) || '';
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px',
      background: scrolled ? 'rgba(8,3,6,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
      transition: 'all 0.3s',
    }}>
      {/* Logo */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg, var(--sakura), var(--crimson), var(--gold))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>SVS.</span>
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.14em' }}>TSUSHIMA</span>
      </button>

      {/* Center / Desktop Navigation Links */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="nav-desktop">
        {LINKS.map(l => (
          <button key={l.id} onClick={() => scrollTo(l.id)}
            style={{
              position: 'relative', background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 14px', borderRadius: 10, fontSize: '0.83rem', fontWeight: 600,
              color: active === l.id ? 'var(--sakura)' : 'var(--text-muted)',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--sakura)'}
            onMouseLeave={e => e.currentTarget.style.color = active === l.id ? 'var(--sakura)' : 'var(--text-muted)'}
          >
            {l.label}
            {active === l.id && (
              <motion.span layoutId="nav-pill" style={{
                position: 'absolute', inset: 0, borderRadius: 10,
                background: 'var(--tag-bg)', border: '1px solid var(--tag-border)', zIndex: -1,
              }} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
            )}
          </button>
        ))}
      </div>

      {/* Right: Tsushima Stance Dial */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <StanceSelector compact={false} />
      </div>

      {/* Mobile Hamburger */}
      <button onClick={() => setMenuOpen(o => !o)} className="nav-hamburger"
        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.4rem' }}>
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ position: 'absolute', top: 64, left: 0, right: 0, background: 'rgba(8,3,6,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--glass-border)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LINKS.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', textAlign: 'left', fontSize: '1rem', fontWeight: 600, color: active === l.id ? 'var(--sakura)' : 'var(--text)' }}>
                {l.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <style>{"@media(max-width:860px){.nav-desktop{display:none!important;}.nav-hamburger{display:flex!important;}}"}</style>
    </nav>
  );
}
