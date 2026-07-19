import { motion } from "framer-motion";
import Reveal from "./Reveal";

const education = [
  {
    icon: "🎓",
    title: "Bachelor's in Computing Science & Engineering",
    institute: "Dayananda Sagar University",
    duration: "2022 - 2026",
    score: "CGPA: 7.85",
    description:
      "Focused on Artificial Intelligence, DevOps, Cloud Computing, Agile Methodologies, Full Stack Development and Digital Systems Engineering.",
    color: "cyan",
  },
  {
    icon: "🏫",
    title: "Class XII",
    institute: "The Narayana Institutions",
    duration: "2020 - 2022",
    score: "79%",
    description:
      "Completed higher secondary education with focus on analytical problem-solving, mathematics and computer science foundations.",
    color: "pink",
  },
  {
    icon: "🏫",
    title: "Class X",
    institute: "The Aditya Birla Public School",
    duration: "2012 - 2020",
    score: "72%",
    description:
      "Built strong academic foundations while actively developing communication, leadership and technical interests.",
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

function Education() {
  return (
    <Reveal>
      <section id="education" className="section">
        <h2 className="text-4xl md:text-5xl font-bold neonPink mb-14">
          Education
        </h2>

        <div className="space-y-6">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={IS_LOW ? false : { opacity: 0, y: 40 }}
              whileInView={IS_LOW ? false : { opacity: 1, y: 0 }}
              transition={{
                duration: IS_MEDIUM ? 0.4 : 0.7,
                delay: index * (IS_MEDIUM ? 0.1 : 0.2),
              }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <span className="text-3xl">{edu.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{edu.title}</h3>
                  <p className="text-cyan-400">{edu.institute}</p>
                </div>
              </div>

              <p className="text-gray-400 mb-4 leading-relaxed">
                {edu.description}
              </p>

              <div className="flex gap-4">
                <span className="px-3 py-1 text-sm bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full">
                  {edu.duration}
                </span>
                <span className="px-3 py-1 text-sm bg-pink-500/10 border border-pink-500/30 text-pink-300 rounded-full">
                  {edu.score}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

export default Education;
