import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import Reveal from "./Reveal";

const projects = [
  {
    title: "Aerial Object Detection",
    repo_url: "https://github.com/SVSS13/Aerial-Object-Detection",
    desc: "Aerial Object Detection using Deep Learning that classifies and detects birds and drones in aerial images for safety and surveillance applications.",
    tech: "Python • YOLOv8 • OpenCV • TensorFlow",
  },
  {
    title: "AI Cyberpunk Portfolio",
    repo_url: "https://github.com/SVSS13/ai-cyberpunk-portfolio",
    desc: "AI-powered futuristic cyberpunk portfolio with React, Django, Groq AI, analytics dashboard and Android deployment support.",
    tech: "React • Django • Groq AI • Tailwind",
  },
  {
    title: "Footfall Counter",
    repo_url: "https://github.com/SVSS13/Footfall-Counter",
    desc: "Smart AI-powered footfall counting system using YOLOv8 and centroid tracking for crowd analytics.",
    tech: "Python • YOLOv8 • OpenCV",
  },
  {
    title: "Pothole Detection System",
    repo_url: "https://github.com/SVSS13/patholedetection",
    desc: "AI-powered pothole detection and smart traffic monitoring system using computer vision and deep learning.",
    tech: "React • Django • YOLO • OpenCV",
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
              initial={IS_LOW ? false : { opacity: 0, y: 80 }}
              whileInView={IS_LOW ? false : { opacity: 1, y: 0 }}
              transition={{
                duration: IS_LOW ? 0 : IS_MEDIUM ? 0.35 : 0.7,
                delay: IS_LOW ? 0 : index * (IS_MEDIUM ? 0.05 : 0.1),
              }}
              viewport={{ once: true }}
            >
              {IS_LOW ? (
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
                      <button
                        onClick={() => window.open(project.repo_url, "_blank")}
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
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Tilt
                  glareEnable={!IS_MEDIUM}
                  glareMaxOpacity={0.2}
                  scale={1.02}
                  transitionSpeed={IS_MEDIUM ? 1000 : 2500}
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
                        <button
                          onClick={() =>
                            window.open(project.repo_url, "_blank")
                          }
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
                        </button>
                      </div>
                    </div>
                  </div>
                </Tilt>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

export default Projects;
