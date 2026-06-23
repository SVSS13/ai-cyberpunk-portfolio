import { motion } from "framer-motion";

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

function MusicVisualizer() {
  // Low-end: static bars, no animation
  const barCount = IS_LOW ? 20 : IS_MEDIUM ? 30 : 50;
  const bars = Array.from({ length: barCount }, (_, index) => ({
    id: index,
    height: 20 + ((index * 17) % 90),
    duration: 0.8 + ((index * 13) % 10) / 10,
  }));

  // Low-end: render static bars with CSS gradient only
  if (IS_LOW) {
    return (
      <div
        className="
          fixed
          bottom-0
          left-0
          w-full
          flex
          justify-center
          items-end
          gap-[3px]
          z-40
          pointer-events-none
          opacity-80
        "
      >
        {bars.map((bar) => (
          <div
            key={bar.id}
            className="
              w-[4px]
              rounded-full
              bg-gradient-to-t
              from-cyan-400
              via-pink-500
              to-purple-500
              shadow-[0_0_15px_#00FFFF]
            "
            style={{
              height: `${bar.height}px`,
            }}
          />
        ))}
      </div>
    );
  }

  // Medium: fewer bars, slower animation
  const transitionDuration = IS_MEDIUM ? 1.5 : undefined;

  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        w-full
        flex
        justify-center
        items-end
        gap-[3px]
        z-40
        pointer-events-none
        opacity-80
      "
    >
      {bars.map((bar) => (
        <motion.div
          key={bar.id}
          animate={{
            height: [
              `${bar.height}px`,
              `${bar.height / 2}px`,
              `${bar.height}px`,
            ],
          }}
          transition={{
            duration: transitionDuration || bar.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="
            w-[4px]
            rounded-full
            bg-gradient-to-t
            from-cyan-400
            via-pink-500
            to-purple-500
            shadow-[0_0_15px_#00FFFF]
          "
          style={{
            height: `${bar.height}px`,
          }}
        />
      ))}
    </div>
  );
}

export default MusicVisualizer;
