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

function GridBackground() {
  const glowBlur = IS_LOW ? 40 : IS_MEDIUM ? 80 : 160;
  const gridOpacity = IS_LOW ? 0.04 : 0.08;

  return (
    <div
      className="
        fixed
        inset-0
        -z-30
        overflow-hidden
        pointer-events-none
      "
    >
      {/* =========================
          MAIN GRID
      ========================= */}
      <div
        className="
          absolute
          inset-0
        "
        style={{
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(
              rgba(0,255,255,0.18) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(0,255,255,0.18) 1px,
              transparent 1px
            )
          `,
          backgroundSize: IS_LOW ? "80px 80px" : "60px 60px",
        }}
      />

      {/* =========================
          CYBER GLOW OVERLAY
      ========================= */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,#00FFFF10,transparent_55%)]
        "
      />

      {/* =========================
          TOP CYAN GLOW
      ========================= */}
      <div
        className="
          absolute
          top-[-250px]
          left-[-250px]
          w-[600px]
          h-[600px]
          rounded-full
          bg-cyan-500/10
          pointer-events-none
        "
        style={{ filter: `blur(${glowBlur}px)` }}
      />

      {/* =========================
          BOTTOM PINK GLOW
      ========================= */}
      <div
        className="
          absolute
          bottom-[-250px]
          right-[-250px]
          w-[600px]
          h-[600px]
          rounded-full
          bg-pink-500/10
          pointer-events-none
        "
        style={{ filter: `blur(${glowBlur}px)` }}
      />
    </div>
  );
}

export default GridBackground;
