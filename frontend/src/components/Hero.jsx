import { motion } from "framer-motion";
import PlanetHero from "./PlanetHero";

// ===== DEVICE DETECTION =====
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

const IS_LOW = getDeviceTier() === "low";

function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050816]/50 to-[#050816]" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 px-6 max-w-7xl mx-auto w-full">
        {/* Text Content */}
        <div className="text-center lg:text-left flex-1">
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-cyan-400 text-sm md:text-base tracking-[0.3em] mb-4 font-medium"
            style={{ textShadow: "0 0 10px rgba(0,255,255,0.5)" }}
          >
            WELCOME TO MY PORTFOLIO
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6"
          >
            <span className="text-white">S V S </span>
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
              style={{ filter: "drop-shadow(0 0 20px rgba(0,255,255,0.3))" }}
            >
              SUJAL
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-8 font-light"
          >
            Build Engineer | Cloud Practitioner | AI Enthusiast
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
          >
            Passionate about building futuristic digital experiences using AI
            systems, DevOps automation, cloud infrastructure and scalable full
            stack technologies.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex gap-4 justify-center lg:justify-start flex-wrap"
          >
            <button
              onClick={() =>
                document
                  .getElementById("projects")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-full font-semibold hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300"
            >
              View Projects
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 bg-pink-500/10 border border-pink-500/50 text-pink-400 rounded-full font-semibold hover:bg-pink-500/20 hover:border-pink-400 hover:shadow-[0_0_30px_rgba(255,0,255,0.3)] transition-all duration-300"
            >
              Get In Touch
            </button>
          </motion.div>
        </div>

        {/* Planet Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex-shrink-0"
        >
          <PlanetHero />

          {/* Floating particles around planet */}
          {!IS_LOW && (
            <>
              <div
                className="orbit-particle"
                style={{
                  top: "20%",
                  left: "10%",
                  animationDelay: "0s",
                }}
              />
              <div
                className="orbit-particle"
                style={{
                  top: "60%",
                  right: "15%",
                  animationDelay: "2s",
                  width: 6,
                  height: 6,
                }}
              />
              <div
                className="orbit-particle"
                style={{
                  bottom: "20%",
                  left: "30%",
                  animationDelay: "4s",
                  width: 3,
                  height: 3,
                }}
              />
            </>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-cyan-500/30 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
