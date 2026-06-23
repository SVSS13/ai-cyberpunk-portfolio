import { useEffect } from "react";

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

function NeonCursor() {
  useEffect(() => {
    // Low-end: skip entirely — default cursor is fine
    if (IS_LOW) return;

    const cursor = document.createElement("div");
    const trail = document.createElement("div");

    /* =========================
       MAIN CURSOR
    ========================= */
    cursor.style.width = "22px";
    cursor.style.height = "22px";
    cursor.style.border = "2px solid #00FFFF";
    cursor.style.borderRadius = "50%";
    cursor.style.position = "fixed";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "9999";
    cursor.style.transform = "translate(-50%, -50%)";
    cursor.style.transition =
      "width 0.25s ease, height 0.25s ease, border 0.25s ease";
    cursor.style.boxShadow = "0 0 15px #00FFFF, 0 0 30px #00FFFF";
    cursor.style.backdropFilter = IS_MEDIUM ? "none" : "blur(4px)";

    /* =========================
       CURSOR TRAIL
    ========================= */
    trail.style.width = "8px";
    trail.style.height = "8px";
    trail.style.background = "#FF00FF";
    trail.style.borderRadius = "50%";
    trail.style.position = "fixed";
    trail.style.pointerEvents = "none";
    trail.style.zIndex = "9998";
    trail.style.transform = "translate(-50%, -50%)";
    trail.style.boxShadow = "0 0 20px #FF00FF, 0 0 40px #FF00FF";
    trail.style.transition = IS_MEDIUM
      ? "all 0.15s linear"
      : "all 0.08s linear";

    document.body.appendChild(cursor);
    document.body.appendChild(trail);

    // Medium: throttle with RAF instead of direct writes
    let rafId = null;
    let pendingX = 0;
    let pendingY = 0;

    const updatePositions = () => {
      cursor.style.left = `${pendingX}px`;
      cursor.style.top = `${pendingY}px`;
      rafId = null;
    };

    const moveCursor = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      if (IS_MEDIUM) {
        pendingX = x;
        pendingY = y;
        if (!rafId) {
          rafId = requestAnimationFrame(updatePositions);
        }
      } else {
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
      }

      // Trail always uses setTimeout for lag effect
      setTimeout(
        () => {
          trail.style.left = `${x}px`;
          trail.style.top = `${y}px`;
        },
        IS_MEDIUM ? 60 : 40,
      );
    };

    const handleHover = () => {
      cursor.style.width = "40px";
      cursor.style.height = "40px";
      cursor.style.border = "2px solid #FF00FF";
      cursor.style.boxShadow = "0 0 20px #FF00FF, 0 0 45px #FF00FF";
    };

    const resetCursor = () => {
      cursor.style.width = "22px";
      cursor.style.height = "22px";
      cursor.style.border = "2px solid #00FFFF";
      cursor.style.boxShadow = "0 0 15px #00FFFF, 0 0 30px #00FFFF";
    };

    window.addEventListener("mousemove", moveCursor);

    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea",
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", resetCursor);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      if (rafId) cancelAnimationFrame(rafId);

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", resetCursor);
      });

      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
      if (document.body.contains(trail)) {
        document.body.removeChild(trail);
      }
    };
  }, []);

  return null;
}

export default NeonCursor;
