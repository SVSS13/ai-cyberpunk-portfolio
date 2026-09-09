import { useEffect } from 'react';

const GLYPHS = ['✿', '❀', '❁', '✾', '🌸', '✦', '⋆', '✵'];
const COLORS = ['#FFB7C5', '#FF8FA3', '#CC2233', '#D4AF37', '#FFD0D8', '#E8607A'];

export default function ScrollGlitter() {
  useEffect(() => {
    let last = 0;
    let lastScroll = window.scrollY;
    let ticking = false;

    const spawn = (count, cx) => {
      for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = 'glitter-particle';
        const x = cx + (Math.random() - 0.5) * 200;
        const y = (window.innerHeight / 2) + (Math.random() - 0.5) * window.innerHeight * 0.7;
        el.style.left = x + 'px';
        el.style.top  = y + 'px';
        el.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        el.style.animationDuration = (0.65 + Math.random() * 0.55) + 's';
        el.style.animationDelay   = (Math.random() * 0.12) + 's';
        el.style.fontSize = (10 + Math.random() * 12) + 'px';
        el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1300);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const now = Date.now();
        const delta = Math.abs(window.scrollY - lastScroll);
        lastScroll = window.scrollY;
        if (delta > 2 && now - last > 45) {
          last = now;
          spawn(Math.min(7, Math.floor(delta / 12) + 2), window.innerWidth / 2);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
