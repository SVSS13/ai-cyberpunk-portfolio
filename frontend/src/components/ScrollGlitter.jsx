import { useEffect, useRef } from 'react';

const GLYPHS = ['✿', '❀', '❁', '✾', '🌸', '✦', '⋆', '✵'];
const COLORS = ['#FFB7C5', '#FF8FA3', '#CC2233', '#D4AF37', '#FFD0D8', '#E8607A'];

export default function ScrollGlitter() {
  const containerRef = useRef(null);

  useEffect(() => {
    let last = 0;
    let lastScroll = window.scrollY;
    let ticking = false;

    const spawn = (count, cx) => {
      const container = containerRef.current;
      if (!container) return;

      // Cap maximum active DOM particle elements to avoid DOM thrashing
      if (container.childElementCount > 10) return;

      const isMobile = window.innerWidth < 768;
      const actualCount = isMobile ? Math.min(2, count) : Math.min(3, count);

      for (let i = 0; i < actualCount; i++) {
        const el = document.createElement('span');
        el.className = 'glitter-particle';
        const x = cx + (Math.random() - 0.5) * (isMobile ? 100 : 180);
        const y = (window.innerHeight / 2) + (Math.random() - 0.5) * window.innerHeight * 0.5;
        el.style.left = x + 'px';
        el.style.top  = y + 'px';
        el.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        el.style.animationDuration = (0.55 + Math.random() * 0.45) + 's';
        el.style.fontSize = (10 + Math.random() * 8) + 'px';
        el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        container.appendChild(el);
        setTimeout(() => el.remove(), 900);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const now = Date.now();
          const delta = Math.abs(window.scrollY - lastScroll);
          lastScroll = window.scrollY;
          if (delta > 8 && now - last > 120) {
            last = now;
            spawn(2, window.innerWidth / 2);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9990,
        overflow: 'hidden',
      }}
    />
  );
}

