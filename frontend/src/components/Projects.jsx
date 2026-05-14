import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";

import Reveal from "./Reveal";

const projects = [
  {
    title: "Cat vs Dog Image Classifier",
    desc: "Machine learning image classification platform using OpenCV and scikit-learn for intelligent image recognition.",
    tech: "Python • OpenCV • scikit-learn",
    github: "#",
  },

  {
    title: "PCB Defect Detection System",
    desc: "Automated PCB inspection system powered by MATLAB image processing and Flask integration.",
    tech: "Python • Flask • MATLAB",
    github: "#",
  },

  {
    title: "Informex Data Analysis App",
    desc: "Interactive analytics dashboard built using R Shiny for dynamic visualization and clustering analysis.",
    tech: "R • Shiny • ggplot2",
    github: "#",
  },

  {
    title: "E KART E-Commerce",
    desc: "Responsive shopping platform featuring category filtering, cart workflows and modern UI interactions.",
    tech: "HTML • CSS • JavaScript",
    github: "#",
  },
];

function Projects() {
  return (
    <Reveal>
      <section id="projects" className="section">
        <h2 className="text-4xl md:text-5xl font-bold neonPink mb-14">
          Featured Projects
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
            >
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.2}
                scale={1.02}
                transitionSpeed={2500}
              >
                <div
                  className="
                    relative
                    overflow-hidden
                    glass
                    rounded-3xl
                    p-8
                    border
                    border-cyan-500/30
                    hover:border-cyan-400
                    hover:shadow-[0_0_40px_#00FFFF55]
                    transition-all
                    duration-500
                    group
                    min-h-[320px]
                  "
                >
                  <div
                    className="
                      absolute
                      inset-0
                      opacity-0
                      group-hover:opacity-100
                      transition
                      duration-500
                      bg-gradient-to-br
                      from-cyan-500/10
                      to-pink-500/10
                    "
                  />

                  <div className="relative z-10">
                    <h3
                      className="
                        text-3xl
                        font-bold
                        mb-5
                        group-hover:text-cyan-300
                        transition
                        duration-300
                      "
                    >
                      {project.title}
                    </h3>

                    <p className="text-gray-300 leading-8 text-lg">
                      {project.desc}
                    </p>

                    <div
                      className="
                        mt-8
                        text-cyan-400
                        font-medium
                        tracking-wide
                      "
                    >
                      {project.tech}
                    </div>

                    <div className="mt-8 flex gap-5">
                      <a
                        href={project.github}
                        target="_blank"
                        className="
                          flex
                          items-center
                          gap-3
                          px-5
                          py-3
                          rounded-full
                          border
                          border-cyan-500
                          hover:bg-cyan-400
                          hover:text-black
                          transition-all
                          duration-300
                        "
                      >
                        <FaGithub />
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

export default Projects;
