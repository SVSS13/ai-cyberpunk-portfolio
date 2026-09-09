import { useEffect, useRef } from 'react';

const SAKURA = [
  [255, 183, 197],
  [255, 120, 150],
  [204,  34,  51],
  [212, 175,  55],
  [255, 208, 216],
];

export function useBrushHover(ref) {
  const canvasRef   = useRef(null);
  const strokesRef  = useRef([]);
  const rafRef      = useRef(null);
  const hoveredRef  = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = [
      'position:absolute', 'inset:0', 'width:100%', 'height:100%',
      'pointer-events:none', 'z-index:6', 'border-radius:inherit',
    ].join(';');
    if (!el.style.position || el.style.position === 'static') el.style.position = 'relative';
    el.appendChild(canvas);
    canvasRef.current = canvas;

    const resize = () => { canvas.width = el.offsetWidth; canvas.height = el.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) { rafRef.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const decay = hoveredRef.current ? 0.005 : 0.016;
      strokesRef.current = strokesRef.current.filter(s => s.op > 0.01);
      for (const s of strokesRef.current) {
        ctx.save();
        ctx.globalAlpha = s.op * 0.85;
        ctx.strokeStyle = s.color;
        ctx.lineWidth   = s.w;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.filter      = 'blur(0.6px)';
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
      if (Math.random() < 0.30) {
        const [cr, cg, cb] = SAKURA[Math.floor(Math.random() * SAKURA.length)];
        const a = Math.random() * Math.PI * 2;
        const l = 14 + Math.random() * 42;
        strokesRef.current.push({
          pts: [
            { x, y },
            { x: x + Math.cos(a) * l * 0.38, y: y + Math.sin(a) * l * 0.38 },
            { x: x + Math.cos(a) * l, y: y + Math.sin(a) * l },
          ],
          op:    0.38 + Math.random() * 0.22,
          w:     5 + Math.random() * 14,
          color: 'rgba(' + cr + ',' + cg + ',' + cb + ',1)',
        });
      }
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseenter', () => { hoveredRef.current = true; });
    el.addEventListener('mouseleave', () => { hoveredRef.current = false; });

    return () => {
      el.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.remove();
    };
  }, [ref]);
}
