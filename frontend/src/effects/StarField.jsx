import { useEffect, useRef } from "react";

// ===== DEVICE DETECTION =====
const getDeviceTier = () => {
  if (typeof window === "undefined") return "high";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return "low";
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  if (cores <= 4 && memory <= 4) return "low";
  if (cores <= 6) return "medium";
  return "high";
};

const TIER = getDeviceTier();
const IS_LOW = TIER === "low";
const IS_MEDIUM = TIER === "medium";

function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (IS_LOW) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrame;
    let lastDraw = 0;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Star layers for parallax
    const layers = [
      { count: IS_MEDIUM ? 50 : 120, speed: 0.02, size: 0.8, opacity: 0.8 },
      { count: IS_MEDIUM ? 30 : 70, speed: 0.05, size: 1.2, opacity: 0.6 },
      { count: IS_MEDIUM ? 15 : 30, speed: 0.1, size: 1.8, opacity: 0.4 },
    ];

    const stars = [];

    layers.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: layer.size + Math.random() * 0.5,
          speed: layer.speed,
          opacity: layer.opacity,
          layer: layerIndex,
          twinkleOffset: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    });

    // Shooting stars
    const shootingStars = [];
    let lastShootingStar = 0;

    const draw = (timestamp) => {
      // Medium: throttle to 30fps
      if (IS_MEDIUM) {
        const elapsed = timestamp - lastDraw;
        if (elapsed < 33) {
          animationFrame = requestAnimationFrame(draw);
          return;
        }
        lastDraw = timestamp;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check if light mode
      const isLight = document.documentElement.classList.contains("light-mode");
      const starColor = isLight ? "26, 32, 44" : "255, 255, 255";

      // Draw stars
      stars.forEach((star) => {
        const twinkle = Math.sin(timestamp * 0.001 * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.opacity * (0.5 + 0.5 * twinkle);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starColor}, ${alpha})`;
        ctx.fill();

        // Glow for brighter stars
        if (star.size > 1.5 && !IS_MEDIUM) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${starColor}, ${alpha * 0.15})`;
          ctx.fill();
        }

        // Slow drift
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Spawn shooting stars
      if (!IS_MEDIUM && timestamp - lastShootingStar > 4000 + Math.random() * 6000) {
        shootingStars.push({
          x: Math.random() * canvas.width * 0.5,
          y: Math.random() * canvas.height * 0.3,
          speedX: 8 + Math.random() * 4,
          speedY: 4 + Math.random() * 2,
          length: 80 + Math.random() * 60,
          life: 1,
          decay: 0.02 + Math.random() * 0.01,
        });
        lastShootingStar = timestamp;
      }

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        const gradient = ctx.createLinearGradient(s.x, s.y, s.x - s.length, s.y - s.length * 0.5);
        gradient.addColorStop(0, `rgba(${starColor}, ${s.life})`);
        gradient.addColorStop(1, `rgba(${starColor}, 0)`);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.length, s.y - s.length * 0.5);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        s.x += s.speedX;
        s.y += s.speedY;
        s.life -= s.decay;

        if (s.life <= 0 || s.x > canvas.width || s.y > canvas.height) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  if (IS_LOW) return null;

  return (
    <canvas
      ref={canvasRef}
      className="starfield-canvas"
      style={{ position: "fixed", inset: 0, zIndex: -18, pointerEvents: "none" }}
    />
  );
}

export default StarField;
