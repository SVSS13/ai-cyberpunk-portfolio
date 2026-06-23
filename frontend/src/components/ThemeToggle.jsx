import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
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

// Static variants (no animation objects recreated per render)
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const iconVariants = {
  enter: { rotate: -180, opacity: 0, scale: 0.5 },
  center: { rotate: 0, opacity: 1, scale: 1 },
  exit: { rotate: 180, opacity: 0 },
};

function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (dark) {
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  }, [dark]);

  // Low-end: no Framer Motion, instant switch
  if (IS_LOW) {
    return (
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setDark(!dark)}
          className="
            relative
            w-20
            h-20
            rounded-full
            glass
            border
            border-cyan-500/20
            flex
            items-center
            justify-center
            overflow-hidden
            hover:border-cyan-400
            transition-all
            duration-200
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-cyan-500/10
              to-pink-500/10
            "
          />
          <div className="relative z-10 text-3xl">
            {dark ? (
              <FaMoon className="text-cyan-400 [filter:drop-shadow(0_0_15px_#00FFFF)]" />
            ) : (
              <FaSun className="text-yellow-400 drop-shadow-[0_0_15px_#FFD700]" />
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 1, duration: IS_MEDIUM ? 0.3 : 0.5 }}
      className="
        fixed
        right-6
        bottom-6
        z-50
      "
    >
      <motion.button
        whileHover={IS_MEDIUM ? {} : { scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setDark(!dark)}
        className="
          relative
          w-20
          h-20
          rounded-full
          glass
          border
          border-cyan-500/20
          flex
          items-center
          justify-center
          overflow-hidden
          hover:border-cyan-400
          hover:shadow-[0_0_30px_#00FFFF55]
          transition-all
          duration-500
        "
      >
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-cyan-500/10
            to-pink-500/10
          "
        />

        <motion.div
          key={dark ? "moon" : "sun"}
          variants={iconVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: IS_MEDIUM ? 0.2 : 0.4 }}
          className="
            relative
            z-10
            text-3xl
          "
        >
          {dark ? (
            <FaMoon className="text-cyan-400 [filter:drop-shadow(0_0_15px_#00FFFF)]" />
          ) : (
            <FaSun className="text-yellow-400 drop-shadow-[0_0_15px_#FFD700]" />
          )}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}

export default ThemeToggle;
