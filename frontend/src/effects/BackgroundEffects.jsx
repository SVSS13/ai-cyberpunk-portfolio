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

function BackgroundEffects() {
  // Low-end: static blurred shapes, no animation
  if (IS_LOW) {
    return (
      <>
        <div
          className="fixed top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/20 rounded-full pointer-events-none -z-20"
          style={{ filter: "blur(60px)" }}
        />
        <div
          className="fixed top-[0] right-[-200px] w-[500px] h-[500px] bg-pink-500/20 rounded-full pointer-events-none -z-20"
          style={{ filter: "blur(60px)" }}
        />
        <div
          className="fixed bottom-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full pointer-events-none -z-20"
          style={{ filter: "blur(80px)" }}
        />
      </>
    );
  }

  // Medium: reduced blur, slower pulse
  const blurSize = IS_MEDIUM ? 80 : 140;
  const bottomBlur = IS_MEDIUM ? 100 : 180;
  const pulseClass = IS_MEDIUM
    ? "animate-[pulse_4s_ease-in-out_infinite]"
    : "animate-pulse";

  return (
    <>
      {/* TOP LEFT GLOW */}
      <div
        className={`
          fixed
          top-[-200px]
          left-[-200px]
          w-[500px]
          h-[500px]
          bg-cyan-500/20
          rounded-full
          pointer-events-none
          -z-20
          ${pulseClass}
        `}
        style={{ filter: `blur(${blurSize}px)` }}
      />

      {/* TOP RIGHT GLOW */}
      <div
        className={`
          fixed
          top-[0]
          right-[-200px]
          w-[500px]
          h-[500px]
          bg-pink-500/20
          rounded-full
          pointer-events-none
          -z-20
          ${pulseClass}
        `}
        style={{ filter: `blur(${blurSize}px)` }}
      />

      {/* BOTTOM CENTER GLOW */}
      <div
        className="
          fixed
          bottom-[-200px]
          left-1/2
          -translate-x-1/2
          w-[600px]
          h-[600px]
          bg-purple-500/20
          rounded-full
          pointer-events-none
          -z-20
        "
        style={{ filter: `blur(${bottomBlur}px)` }}
      />
    </>
  );
}

export default BackgroundEffects;
