import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StanceSelector from './StanceSelector';
import { useFileInspector } from '../context/FileInspectorContext';

const LINKS = [
  { id: 'about',      label: 'About'      },
  { id: 'skills',     label: 'Skills'     },
  { id: 'projects',   label: 'Projects'   },
  { id: 'experience', label: 'Experience' },
  { id: 'github',     label: 'GitHub'     },
  { id: 'contact',    label: 'Contact'    },
];

export default function Navbar() {
  const { openFile } = useFileInspector();
  const [active,   setActive]   = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled(prev => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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

      {/* Right: Inspect Files Button + Tsushima Stance Dial */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => openFile('cv')}
          style={{
            background: 'rgba(255,183,197,0.12)',
            border: '1px solid var(--glass-border)',
            borderRadius: 50,
            padding: '4px 12px',
            color: 'var(--sakura)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            transition: 'all 0.2s',
          }}
          title="Open Fullscreen File Inspector"
        >
          <span>📁</span>
          <span>Inspect Files</span>
        </button>
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
            <button
              onClick={() => {
                setMenuOpen(false);
                openFile('cv');
              }}
              style={{
                background: 'rgba(255,183,197,0.12)',
                border: '1px solid var(--glass-border)',
                borderRadius: 8,
                padding: '10px 14px',
                color: 'var(--sakura)',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>📁</span>
              <span>Inspect Files & CV</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{"@media(max-width:860px){.nav-desktop{display:none!important;}.nav-hamburger{display:flex!important;}}"}</style>
    </nav>
  );
}
