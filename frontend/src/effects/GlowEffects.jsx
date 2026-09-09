import { useEffect } from "react";

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

function GlowEffects() {
  useEffect(() => {
    if (IS_LOW) return;

    const glow = document.createElement("div");

    glow.style.width = IS_MEDIUM ? "200px" : "300px";
    glow.style.height = IS_MEDIUM ? "200px" : "300px";
    glow.style.position = "fixed";
    glow.style.borderRadius = "50%";
    glow.style.pointerEvents = "none";
    glow.style.zIndex = "999";
    glow.style.background =
      "radial-gradient(circle, rgba(0,255,255,0.18), transparent 70%)";
    glow.style.transform = "translate(-50%, -50%)";

    glow.style.transition = IS_MEDIUM
      ? "transform 0.15s linear"
      : "transform 0.08s linear";

    document.body.appendChild(glow);

    let lastMove = 0;
    let pendingX = 0;
    let pendingY = 0;
    let rafId = null;

    const updateGlow = () => {
      glow.style.left = `${pendingX}px`;
      glow.style.top = `${pendingY}px`;
      rafId = null;
    };

    const moveGlow = (e) => {
      if (IS_MEDIUM) {
        pendingX = e.clientX;
        pendingY = e.clientY;
        if (!rafId) {
          rafId = requestAnimationFrame(updateGlow);
        }
      } else {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", moveGlow);

    return () => {
      window.removeEventListener("mousemove", moveGlow);
      if (rafId) cancelAnimationFrame(rafId);
      if (document.body.contains(glow)) {
        document.body.removeChild(glow);
      }
    };
  }, []);

  return null;
}

export default GlowEffects;
