import { useEffect, useRef } from "react";

// ===== DEVICE DETECTION (inline) =====
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

function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Low-end: render static CSS fallback, skip canvas entirely
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

    const letters =
      "アァカサタナハマヤャラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*";

    const fontSize = 16;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

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

      ctx.fillStyle = "rgba(5, 8, 22, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Medium: skip gradient + shadow (solid color only)
        if (IS_MEDIUM) {
          ctx.fillStyle = "#00FFFF";
          ctx.shadowBlur = 0;
        } else {
          const gradient = ctx.createLinearGradient(x, y - 20, x, y + 20);
          gradient.addColorStop(0, "#00FFFF");
          gradient.addColorStop(1, "#7F00FF");
          ctx.fillStyle = gradient;
          ctx.shadowColor = "#00FFFF";
          ctx.shadowBlur = 12;
        }

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  // Low-end: CSS static rain pattern (zero JS animation)
  if (IS_LOW) {
    return (
      <div
        className="
          fixed
          inset-0
          -z-20
          opacity-[0.13]
          pointer-events-none
        "
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,255,255,0.03) 50%, transparent 100%)",
          backgroundSize: "100% 200px",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="
        fixed
        inset-0
        -z-20
        opacity-[0.13]
        pointer-events-none
      "
    />
  );
}

export default MatrixRain;
