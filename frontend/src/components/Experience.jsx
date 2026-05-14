import { motion } from "framer-motion";

import { FaProjectDiagram, FaDocker, FaBrain } from "react-icons/fa";

import Reveal from "./Reveal";

const experiences = [
  {
    icon: <FaProjectDiagram />,

    title: "Agile & Project Management",

    desc: "Experienced in Agile methodologies including Scrum, Lean, XP and Kanban with strong collaboration, planning and leadership skills.",

    glow: "cyan",
  },

  {
    icon: <FaDocker />,

    title: "DevOps & Automation",

    desc: "Worked with Docker, Jenkins, GitHub and automation workflows to streamline CI/CD pipelines and deployment processes.",

    glow: "pink",
  },

  {
    icon: <FaBrain />,

    title: "AI & Image Processing",

    desc: "Built intelligent machine learning and image processing systems using Python, OpenCV, MATLAB and scikit-learn.",

    glow: "purple",
  },
];

function Experience() {
  return (
    <Reveal>
      <section className="section">
        <motion.h2
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          viewport={{
            once: true,
          }}
          className="
            text-4xl
            md:text-5xl
            font-bold
            neonText
            mb-16
          "
        >
          Experience & Interests
        </motion.h2>

        <div
          className="
            relative
            ml-16
            space-y-14
          "
        >
          {/* TIMELINE LINE */}

          <div
            className="
              absolute
              left-0
              top-0
              w-[2px]
              h-full
              bg-cyan-500/30
            "
          />

          {experiences.map((item, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                x: -80,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
              }}
              viewport={{
                once: true,
              }}
              whileHover={{
                scale: 1.02,
              }}
              className="
                  relative
                  pl-14
                "
            >
              {/* ICON */}

              <div
                className={`
                    absolute
                    left-[-24px]
                    top-1/2 
                    -translate-y-1/2
                    w-12
                    h-12
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xl
                    z-20
                    shadow-[0_0_30px_#00FFFF]

                    ${
                      item.glow === "cyan"
                        ? `
                          bg-cyan-400
                          text-black
                        `
                        : item.glow === "pink"
                          ? `
                          bg-pink-500
                          text-white
                        `
                          : `
                          bg-purple-500
                          text-white
                        `
                    }
                  `}
              >
                {item.icon}
              </div>

              {/* CARD */}

              <div
                className="
                    glass
                    rounded-3xl
                    p-8
                    border
                    border-cyan-500/20
                    hover:border-cyan-400
                    hover:shadow-[0_0_40px_#00FFFF33]
                    transition-all
                    duration-500
                    group
                    relative
                    overflow-hidden
                  "
              >
                {/* GLOW */}

                <div
                  className={`
                      absolute
                      top-0
                      right-0
                      w-44
                      h-44
                      blur-[100px]
                      rounded-full
                      opacity-20

                      ${
                        item.glow === "cyan"
                          ? "bg-cyan-400"
                          : item.glow === "pink"
                            ? "bg-pink-500"
                            : "bg-purple-500"
                      }
                    `}
                />

                <div className="relative z-10">
                  <h3
                    className="
                        text-2xl
                        md:text-3xl
                        font-bold
                        mb-5
                        group-hover:text-cyan-300
                        transition
                        duration-300
                      "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                        text-gray-300
                        leading-9
                        text-lg
                      "
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

export default Experience;
