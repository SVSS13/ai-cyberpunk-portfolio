import { motion } from "framer-motion";
import { FaGraduationCap, FaSchool, FaUniversity } from "react-icons/fa";
import Reveal from "./Reveal";

const educationData = [
  {
    icon: <FaUniversity />,
    title: "Bachelor's Degree in Computing Science & Engineering",
    institute: "Dayananda Sagar University",
    duration: "2022 - 2026",
    score: "CGPA: 7.65",
    desc: "Focused on Artificial Intelligence, DevOps, Cloud Computing, Agile Methodologies, Full Stack Development and Digital Systems Engineering.",
    glow: "cyan",
  },
  {
    icon: <FaSchool />,
    title: "Class XII",
    institute: "The Narayana Institutions",
    duration: "2020 - 2022",
    score: "79%",
    desc: "Completed higher secondary education with focus on analytical problem-solving, mathematics and computer science foundations.",
    glow: "pink",
  },
  {
    icon: <FaSchool />,
    title: "Class X",
    institute: "The Aditya Birla Public School",
    duration: "2012 - 2020",
    score: "72%",
    desc: "Built strong academic foundations while actively developing communication, leadership and technical interests.",
    glow: "purple",
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
  const glowBlur = IS_LOW ? 30 : IS_MEDIUM ? 70 : 130;
  const h2Duration = IS_LOW ? 0 : IS_MEDIUM ? 0.4 : 0.8;
  const cardDuration = IS_LOW ? 0 : IS_MEDIUM ? 0.4 : 0.8;
  const cardDelay = IS_LOW ? 0 : IS_MEDIUM ? 0.08 : 0.15;

  return (
    <Reveal>
      <section className="section">
        {IS_LOW ? (
          <h2
            className="
              text-4xl
              md:text-5xl
              font-bold
              neonPink
              mb-16
            "
          >
            Education
          </h2>
        ) : (
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: h2Duration }}
            viewport={{ once: true }}
            className="
              text-4xl
              md:text-5xl
              font-bold
              neonPink
              mb-16
            "
          >
            Education
          </motion.h2>
        )}

        <div className="space-y-10">
          {educationData.map((item, index) => (
            <motion.div
              key={index}
              initial={IS_LOW ? false : { opacity: 0, y: 50 }}
              whileInView={IS_LOW ? false : { opacity: 1, y: 0 }}
              transition={{
                duration: cardDuration,
                delay: index * cardDelay,
              }}
              viewport={{ once: true }}
              whileHover={IS_LOW || IS_MEDIUM ? {} : { scale: 1.02 }}
              className="
                glass
                rounded-3xl
                p-10
                border
                border-cyan-500/20
                hover:border-cyan-400
                hover:shadow-[0_0_40px_#00FFFF33]
                transition-all
                duration-500
                relative
                overflow-hidden
              "
            >
              {/* GLOW EFFECT */}
              <div
                className={`
                  absolute
                  top-0
                  right-0
                  w-56
                  h-56
                  rounded-full
                  opacity-20
                  pointer-events-none
                  ${
                    item.glow === "cyan"
                      ? "bg-cyan-400"
                      : item.glow === "pink"
                      ? "bg-pink-500"
                      : "bg-purple-500"
                  }
                `}
                style={{ filter: `blur(${glowBlur}px)` }}
              />

              <div
                className="
                  relative
                  z-10
                  flex
                  gap-6
                  items-start
                "
              >
                {/* ICON */}
                <div
                  className={`
                    w-16
                    h-16
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    text-3xl
                    shadow-[0_0_25px_#00FFFF]
                    ${
                      item.glow === "cyan"
                        ? "bg-cyan-400 text-black"
                        : item.glow === "pink"
                        ? "bg-pink-500 text-white"
                        : "bg-purple-500 text-white"
                    }
                  `}
                >
                  {item.icon}
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <h3
                    className="
                      text-2xl
                      md:text-3xl
                      font-bold
                      mb-3
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      text-cyan-300
                      text-lg
                      mb-4
                    "
                  >
                    {item.institute}
                  </p>

                  <p
                    className="
                      text-gray-300
                      leading-8
                      text-lg
                    "
                  >
                    {item.desc}
                  </p>

                  <div
                    className="
                      mt-6
                      flex
                      flex-wrap
                      gap-4
                    "
                  >
                    <span
                      className="
                        px-4
                        py-2
                        rounded-full
                        bg-cyan-400/10
                        border
                        border-cyan-400/20
                        text-cyan-300
                      "
                    >
                      {item.duration}
                    </span>

                    <span
                      className="
                        px-4
                        py-2
                        rounded-full
                        bg-pink-500/10
                        border
                        border-pink-500/20
                        text-pink-300
                      "
                    >
                      {item.score}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

export default Education;
