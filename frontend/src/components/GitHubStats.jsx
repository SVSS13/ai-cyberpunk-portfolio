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

function GitHubStats() {
  const totalStars = repos.reduce((a, r) => a + r.stars, 0);
  const totalForks = repos.reduce((a, r) => a + r.forks, 0);

  return (
    <section id="github" className="section">
      <h2 className="section-title">GitHub Repositories</h2>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "var(--gap)", marginBottom: "var(--gap)" }}>
        {[
          { label: "Repositories", value: repos.length, icon: "📁" },
          { label: "Total Stars",  value: totalStars,    icon: "★" },
          { label: "Total Forks",  value: totalForks,    icon: "⑂" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="bento-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ fontSize: "1.4rem", marginBottom: "4px" }}>{stat.icon}</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.04em" }}>{stat.value}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{stat.label}</div>
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
            className="bento-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            style={{ textDecoration: "none", display: "block" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: langColors[repo.language] || "#888",
                flexShrink: 0,
              }} />
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{repo.name}</h3>
              <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--text-muted)" }}>↗</span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>
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
          className="btn-accent"
        >
          View Full GitHub Profile →
        </a>
      </div>
    </section>
  );
}

export default GitHubStats;
