import { useEffect } from 'react';

// Sakura & Crimson Sumi-e Ink Colors
const SAKURA_PALETTE = [
  { r: 255, g: 183, b: 197, glow: 'rgba(255,183,197,0.6)' }, // Soft Sakura
  { r: 255, g: 120, b: 150, glow: 'rgba(255,120,150,0.6)' }, // Blossom Pink
  { r: 217, g:  32, b:  56, glow: 'rgba(217,32,56,0.6)'   }, // Tsushima Crimson
  { r: 232, g:  93, b:  53, glow: 'rgba(232,93,53,0.5)'   }, // Sunset Vermillion
  { r: 212, g: 175, b:  55, glow: 'rgba(212,175,55,0.6)'  }, // Samurai Gold
  { r: 255, g: 215, b: 225, glow: 'rgba(255,215,225,0.7)' }, // Luminous Petal
];

export default function GlobalBrush() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = [
      'position:fixed', 'inset:0', 'width:100%', 'height:100%',
      'pointer-events:none', 'z-index:9998',
    ].join(';');
    document.body.appendChild(canvas);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const ctx = canvas.getContext('2d');
    const strokes = [];
    const particles = [];
    let raf;
    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();
    let isMoving = false;
    let idleTimer = null;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const decay = isMoving ? 0.007 : 0.015;

      // Draw brush ribbon strokes
      for (let i = strokes.length - 1; i >= 0; i--) {
        const s = strokes[i];
        s.alpha -= decay;
        if (s.alpha <= 0.005) {
          strokes.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.min(1, s.alpha * 1.2);
        ctx.strokeStyle = `rgba(${s.color.r},${s.color.g},${s.color.b},${s.alpha})`;
        ctx.lineWidth = s.width * s.alpha;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = s.color.glow;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.moveTo(s.fromX, s.fromY);
        ctx.quadraticCurveTo(s.cpX, s.cpY, s.toX, s.toY);
        ctx.stroke();
        ctx.restore();
      }

      // Draw flying ink blossom particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        p.alpha -= 0.012;
        p.size *= 0.99;

        if (p.alpha <= 0.005) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.alpha})`;
        ctx.shadowColor = p.color.glow;
        ctx.shadowBlur = 6;

        // Petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onMove = (e) => {
      isMoving = true;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { isMoving = false; }, 100);

      const now = Date.now();
      const dt = Math.max(1, now - lastTime);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      const speed = dist / dt;

      if (lastX !== 0 && lastY !== 0 && dist > 2) {
        const color = SAKURA_PALETTE[Math.floor(Math.random() * SAKURA_PALETTE.length)];
        const width = Math.min(26, Math.max(4, 22 - speed * 4));

        // Calligraphy segment with control point
        strokes.push({
          fromX: lastX,
          fromY: lastY,
          toX: e.clientX,
          toY: e.clientY,
          cpX: (lastX + e.clientX) / 2 + (Math.random() - 0.5) * 6,
          cpY: (lastY + e.clientY) / 2 + (Math.random() - 0.5) * 6,
          width,
          color,
          alpha: 0.65,
        });

        // Spawn ink sakura petals on swift movement
        if (Math.random() < 0.45) {
          const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.2;
          const pSpeed = 0.5 + Math.random() * 2.2;
          particles.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * pSpeed,
            vy: Math.sin(angle) * pSpeed + 0.3,
            rot: Math.random() * Math.PI * 2,
            vrot: (Math.random() - 0.5) * 0.08,
            size: 3.5 + Math.random() * 5.5,
            color,
            alpha: 0.8,
          });
        }
      }

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      canvas.remove();
    };
  }, []);

  return null;
}
