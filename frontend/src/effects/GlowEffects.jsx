import { useEffect } from "react";

function GlowEffects() {
  useEffect(() => {
    const glow = document.createElement("div");

    glow.style.width = "300px";

    glow.style.height = "300px";

    glow.style.position = "fixed";

    glow.style.borderRadius = "50%";

    glow.style.pointerEvents = "none";

    glow.style.zIndex = "999";

    glow.style.background =
      "radial-gradient(circle, rgba(0,255,255,0.18), transparent 70%)";

    glow.style.transform = "translate(-50%, -50%)";

    glow.style.transition = "transform 0.08s linear";

    document.body.appendChild(glow);

    const moveGlow = (e) => {
      glow.style.left = `${e.clientX}px`;

      glow.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", moveGlow);

    return () => {
      window.removeEventListener("mousemove", moveGlow);

      document.body.removeChild(glow);
    };
  }, []);

  return null;
}

export default GlowEffects;
