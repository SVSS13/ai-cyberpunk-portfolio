import { motion } from "framer-motion";
import Reveal from "./Reveal";

const projects = [
  {
    title: "Aerial Object Detection",
    description:
      "Aerial Object Detection using Deep Learning that classifies and detects birds and drones in aerial images for safety and surveillance applications.",
    tech: ["Python", "YOLOv8", "OpenCV", "TensorFlow"],
    github: "https://github.com/SVSS13/Aerial-Object-Detection",
    icon: "🚁",
  },
  {
    title: "AI Cyberpunk Portfolio",
    description:
      "AI-powered futuristic cyberpunk portfolio with React, Django, Groq AI, analytics dashboard and Android deployment support.",
    tech: ["React", "Django", "Groq AI", "Tailwind"],
    github: "https://github.com/SVSS13/ai-cyberpunk-portfolio",
    icon: "🌃",
  },
  {
    title: "Footfall Counter",
    description:
      "Smart AI-powered footfall counting system using YOLOv8 and centroid tracking for crowd analytics.",
    tech: ["Python", "YOLOv8", "OpenCV"],
    github: "https://github.com/SVSS13/Footfall-Counter",
    icon: "👥",
  },
  {
    title: "Pothole Detection System",
    description:
      "AI-powered pothole detection and smart traffic monitoring system using computer vision and deep learning.",
    tech: ["React", "Django", "YOLO", "OpenCV"],
    github: "https://github.com/SVSS13/patholedetection",
    icon: "🛣️",
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

const CARD_DELAY = IS_LOW ? 0 : IS_MEDIUM ? 0.1 : 0.2;

function Projects() {
  return (
    <Reveal>
      <section id="projects" className="section">
        <h2 className="text-4xl md:text-5xl font-bold neonPink mb-14">
          Featured Projects
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={IS_LOW ? false : { opacity: 0, y: 50 }}
              whileInView={IS_LOW ? false : { opacity: 1, y: 0 }}
              transition={{
                duration: IS_MEDIUM ? 0.4 : 0.7,
                delay: index * CARD_DELAY,
              }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300 group"
            >
              {/* Icon & Title */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{project.icon}</span>
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-400 mb-6 leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* GitHub Link */}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors font-medium"
              >
                <span>View on GitHub</span>
                <span>→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

export default Projects;
