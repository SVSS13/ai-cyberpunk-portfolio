import { useEffect, useRef } from "react";

function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    let animationFrame;

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

    const draw = () => {
      ctx.fillStyle = "rgba(5, 8, 22, 0.08)";

      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];

        const x = i * fontSize;

        const y = drops[i] * fontSize;

        const gradient = ctx.createLinearGradient(x, y - 20, x, y + 20);

        gradient.addColorStop(0, "#00FFFF");

        gradient.addColorStop(1, "#7F00FF");

        ctx.fillStyle = gradient;

        ctx.shadowColor = "#00FFFF";

        ctx.shadowBlur = 12;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

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
