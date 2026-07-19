import { motion } from "framer-motion";
import Reveal from "./Reveal";

const experiences = [
  {
    icon: "⚡",
    title: "Agile & Project Management",
    description:
      "Experienced in Agile methodologies including Scrum, Lean, XP and Kanban with strong collaboration, planning and leadership skills.",
    color: "cyan",
  },
  {
    icon: "🐳",
    title: "DevOps & Automation",
    description:
      "Worked with Docker, Jenkins, GitHub and automation workflows to streamline CI/CD pipelines and deployment processes.",
    color: "pink",
  },
  {
    icon: "🧠",
    title: "AI & Image Processing",
    description:
      "Built intelligent machine learning and image processing systems using Python, OpenCV, MATLAB and scikit-learn.",
    color: "purple",
  },
];

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

function Experience() {
  return (
    <Reveal>
      <section id="experience" className="section">
        <h2 className="text-4xl md:text-5xl font-bold neonPink mb-14">
          Experience & Interests
        </h2>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={IS_LOW ? false : { opacity: 0, x: -50 }}
              whileInView={IS_LOW ? false : { opacity: 1, x: 0 }}
              transition={{
                duration: IS_MEDIUM ? 0.4 : 0.7,
                delay: index * (IS_MEDIUM ? 0.1 : 0.2),
              }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 flex gap-6 items-start hover:scale-[1.01] transition-transform duration-300"
            >
              {/* Icon */}
              <div
                className={`text-4xl p-4 rounded-xl bg-${exp.color}-500/10 border border-${exp.color}-500/30`}
              >
                {exp.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {exp.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

export default Experience;
