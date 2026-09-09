import { useEffect, useRef } from 'react';

export function useBrushHover(ref) {
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);
  const rafRef = useRef(null);
  const hoveredRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = [
      'position:absolute', 'inset:0', 'width:100%', 'height:100%',
      'pointer-events:none', 'z-index:6', 'border-radius:inherit',
      'transition:opacity 0.25s',
    ].join(';');
    el.style.position = el.style.position || 'relative';
    el.appendChild(canvas);
    canvasRef.current = canvas;

    const resize = () => {
      canvas.width  = el.offsetWidth;
      canvas.height = el.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) { rafRef.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const decay = hoveredRef.current ? 0.006 : 0.018;
      strokesRef.current = strokesRef.current.filter(s => s.op > 0.008);
      for (const s of strokesRef.current) {
        ctx.save();
        ctx.globalAlpha = s.op;
        ctx.strokeStyle = 'rgba(0,5,25,0.9)';
        ctx.lineWidth   = s.w;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur  = 4;
        ctx.beginPath();
        ctx.moveTo(s.pts[0].x, s.pts[0].y);
        for (const p of s.pts) ctx.lineTo(p.x, p.y);
        ctx.stroke();
        s.op -= decay;
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (Math.random() < 0.28) {
        const a = Math.random() * Math.PI * 2;
        const l = 12 + Math.random() * 38;
        strokesRef.current.push({
          pts: [
            { x, y },
            { x: x + Math.cos(a) * l * 0.35, y: y + Math.sin(a) * l * 0.35 },
            { x: x + Math.cos(a) * l, y: y + Math.sin(a) * l },
          ],
          op: 0.52 + Math.random() * 0.2,
          w:  7 + Math.random() * 16,
        });
      }
    };
    const onEnter = () => { hoveredRef.current = true; };
    const onLeave = () => { hoveredRef.current = false; };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.remove();
    };
  }, [ref]);
}
