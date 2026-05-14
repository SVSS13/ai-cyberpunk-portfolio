import { useState, useEffect } from "react";

import { FaMoon, FaSun } from "react-icons/fa";

import { motion } from "framer-motion";

function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (dark) {
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  }, [dark]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 1,
      }}
      className="
        fixed
        right-6
        bottom-6
        z-50
      "
    >
      <motion.button
        whileHover={{
          scale: 1.08,
        }}
        whileTap={{
          scale: 0.95,
        }}
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
          initial={{
            rotate: -180,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            rotate: 0,
            opacity: 1,
            scale: 1,
          }}
          exit={{
            rotate: 180,
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="
            relative
            z-10
            text-3xl
          "
        >
          {dark ? (
            <FaMoon className="text-cyan-400 drop-shadow-[0_0_15px_#00FFFF]" />
          ) : (
            <FaSun className="text-yellow-400 drop-shadow-[0_0_15px_#FFD700]" />
          )}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}

export default ThemeToggle;
