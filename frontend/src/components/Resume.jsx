import { motion } from "framer-motion";
import Reveal from "./Reveal";

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

function Resume() {
  return (
    <Reveal>
      <section id="resume" className="section">
        <h2 className="text-4xl md:text-5xl font-bold neonPink mb-14">
          Resume & Credentials
        </h2>

        <div className="glass rounded-2xl p-10 text-center max-w-3xl mx-auto">
          {/* Icon */}
          <motion.div
            initial={IS_LOW ? false : { scale: 0 }}
            whileInView={IS_LOW ? false : { scale: 1 }}
            transition={{ duration: IS_MEDIUM ? 0.3 : 0.6 }}
            viewport={{ once: true }}
            className="text-6xl mb-6"
          >
            📄
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-4">
            Download My Resume
          </h3>

          {/* Description */}
          <p className="text-gray-400 mb-8 leading-relaxed">
            Explore my professional journey, technical expertise,
            certifications, project experience and futuristic development
            capabilities.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="p-4 rounded-xl bg-[#111827]/50">
              <div className="text-3xl font-bold text-cyan-400 mb-1">12+</div>
              <div className="text-sm text-gray-500">Technical Skills</div>
            </div>
            <div className="p-4 rounded-xl bg-[#111827]/50">
              <div className="text-3xl font-bold text-pink-400 mb-1">4+</div>
              <div className="text-sm text-gray-500">Major Projects</div>
            </div>
            <div className="p-4 rounded-xl bg-[#111827]/50">
              <div className="text-3xl font-bold text-purple-400 mb-1">AI</div>
              <div className="text-sm text-gray-500">Future Focus</div>
            </div>
          </div>

          {/* Download Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-cyan-500 text-black font-bold rounded-full hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] transition-shadow duration-300"
            onClick={() => alert("Resume download would trigger here")}
          >
            ⬇ Download Resume
          </motion.button>
        </div>
      </section>
    </Reveal>
  );
}

export default Resume;
