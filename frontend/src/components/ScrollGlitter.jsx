import { useEffect } from 'react';

const GLYPHS = ['✦', '✧', '★', '✸', '✺', '⋆', '✵', '❋', '✴', '✶'];
const COLORS = ['#00d4ff', '#9b59ff', '#ffd700', '#00ff88', '#ff4488', '#ffffff'];

export default function ScrollGlitter() {
  useEffect(() => {
    let last = 0;
    let lastScroll = window.scrollY;
    let ticking = false;

    const spawn = (count, cx) => {
      for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = 'glitter-particle';
        const x = cx + (Math.random() - 0.5) * 180;
        const y = (window.innerHeight / 2) + (Math.random() - 0.5) * window.innerHeight * 0.7;
        el.style.left = x + 'px';
        el.style.top  = y + 'px';
        el.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        el.style.animationDuration = (0.6 + Math.random() * 0.6) + 's';
        el.style.animationDelay   = (Math.random() * 0.15) + 's';
        el.style.fontSize = (10 + Math.random() * 10) + 'px';
        el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const now = Date.now();
        const delta = Math.abs(window.scrollY - lastScroll);
        lastScroll = window.scrollY;
        if (delta > 2 && now - last > 50) {
          last = now;
          const cx = window.innerWidth / 2;
          spawn(Math.min(6, Math.floor(delta / 15) + 2), cx);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
