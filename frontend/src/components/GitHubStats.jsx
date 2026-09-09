import { motion } from "framer-motion";

const repos = [
  { name: "Aerial-Object-Detection", description: "Deep learning aerial detection system", stars: 12, forks: 3, language: "Python" },
  { name: "ai-cyberpunk-portfolio",  description: "AI-powered portfolio with analytics",   stars: 28, forks: 7, language: "React" },
  { name: "Footfall-Counter",        description: "AI footfall counting with YOLOv8",      stars: 8,  forks: 2, language: "Python" },
  { name: "patholedetection",        description: "Pothole detection & traffic monitoring", stars: 15, forks: 4, language: "React" },
  { name: "SVSS13",                  description: "Personal GitHub profile repository",    stars: 5,  forks: 1, language: "HTML" },
  { name: "react-projects",          description: "Collection of React experiments",       stars: 3,  forks: 0, language: "React" },
];

const langColors = {
  Python: "#3776AB",
  React:  "#61DAFB",
  HTML:   "#E34F26",
  JS:     "#F7DF1E",
};

const VP = { once: true, amount: 0.05 };

export default function GitHubStats() {
  const totalStars = repos.reduce((a, r) => a + r.stars, 0);
  const totalForks = repos.reduce((a, r) => a + r.forks, 0);

  return (
    <section id="github" className="section">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VP}
        style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--sakura)", marginBottom: 8 }}
      >
        // CODE REPOSITORIES
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ delay: 0.05 }}
        className="section-title"
      >
        GitHub <span className="neon-cyan">Repositories</span>
      </motion.h2>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "var(--gap)", marginBottom: "var(--gap)" }}>
        {[
          { label: "Repositories", value: repos.length, icon: "📁" },
          { label: "Total Stars",  value: totalStars,    icon: "★" },
          { label: "Total Forks",  value: totalForks,    icon: "⑂" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="glass-card-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VP}
            transition={{ duration: 0.4 }}
            style={{ textAlign: "center", padding: "20px" }}
          >
            <div style={{ fontSize: "1.4rem", marginBottom: "4px" }}>{stat.icon}</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--sakura)", letterSpacing: "-0.04em" }}>{stat.value}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Repo cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--gap)", marginBottom: "24px" }}>
        {repos.map((repo, i) => (
          <motion.a
            key={repo.name}
            href={`https://github.com/SVSS13/${repo.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            style={{ textDecoration: "none", display: "block", padding: "22px 24px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: langColors[repo.language] || "#888",
                flexShrink: 0,
              }} />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>{repo.name}</h3>
              <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--text-muted)" }}>↗</span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>
              {repo.description}
            </p>
            <div style={{ display: "flex", gap: "14px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              <span>★ {repo.stars}</span>
              <span>⑂ {repo.forks}</span>
              <span style={{ color: langColors[repo.language] || "var(--text-muted)" }}>{repo.language}</span>
            </div>
          </motion.a>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <a
          href="https://github.com/SVSS13"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          View Full GitHub Profile →
        </a>
      </div>
    </section>
  );
}
