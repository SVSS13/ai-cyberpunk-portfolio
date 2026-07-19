import { motion } from "framer-motion";
import Reveal from "./Reveal";

const repos = [
  {
    name: "Aerial-Object-Detection",
    description: "Deep learning aerial detection system",
    stars: 12,
    forks: 3,
    language: "Python",
    color: "#00FFFF",
  },
  {
    name: "ai-cyberpunk-portfolio",
    description: "AI-powered portfolio with analytics",
    stars: 28,
    forks: 7,
    language: "React",
    color: "#00FFFF",
  },
  {
    name: "Footfall-Counter",
    description: "AI footfall counting with YOLOv8",
    stars: 8,
    forks: 2,
    language: "Python",
    color: "#00FFFF",
  },
  {
    name: "patholedetection",
    description: "Pothole detection & traffic monitoring",
    stars: 15,
    forks: 4,
    language: "React",
    color: "#00FFFF",
  },
  {
    name: "SVSS13",
    description: "Personal GitHub profile repository",
    stars: 5,
    forks: 1,
    language: "HTML",
    color: "#FF00FF",
  },
  {
    name: "react-projects",
    description: "Collection of React experiments",
    stars: 3,
    forks: 0,
    language: "React",
    color: "#00FFFF",
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

function GitHubStats() {
  return (
    <Reveal>
      <section id="github" className="section">
        <h2 className="text-4xl md:text-5xl font-bold neonPink mb-14">
          GitHub Repositories
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo, index) => (
            <motion.a
              key={index}
              href={`https://github.com/SVSS13/${repo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={IS_LOW ? false : { opacity: 0, scale: 0.9 }}
              whileInView={IS_LOW ? false : { opacity: 1, scale: 1 }}
              transition={{
                duration: IS_MEDIUM ? 0.3 : 0.5,
                delay: index * (IS_MEDIUM ? 0.05 : 0.1),
              }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 hover:scale-[1.03] transition-transform duration-300 block"
            >
              {/* Repo Name */}
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: repo.color,
                    boxShadow: `0 0 10px ${repo.color}`,
                  }}
                />
                {repo.name}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4">{repo.description}</p>

              {/* Stats */}
              <div className="flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span> {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-cyan-400">⑂</span> {repo.forks}
                </span>
                <span className="text-cyan-300">{repo.language}</span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* GitHub Profile Link */}
        <div className="text-center mt-10">
          <a
            href="https://github.com/SVSS13"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-full font-semibold hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300"
          >
            <span>View Full GitHub Profile</span>
            <span>→</span>
          </a>
        </div>
      </section>
    </Reveal>
  );
}

export default GitHubStats;
