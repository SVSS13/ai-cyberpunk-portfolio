import { motion } from "framer-motion";

function MusicVisualizer() {
  const bars = Array.from({ length: 50 }, (_, index) => ({
    id: index,

    height: 20 + ((index * 17) % 90),

    duration: 0.8 + ((index * 13) % 10) / 10,
  }));

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
            duration: bar.duration,

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
