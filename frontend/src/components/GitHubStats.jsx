import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaStar, FaCodeBranch, FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaExternalLinkAlt } from "react-icons/fa";

const repos = [
  {
    name: "Aerial-Object-Detection",
    description: "Deep learning computer vision system engineered for real-time airspace defense and UAV tracking, detecting birds, drones, and aerial hazards in live video feeds.",
    stars: 12,
    forks: 3,
    language: "Python",
    category: "AI / Vision",
    tech: ["YOLOv8", "OpenCV", "PyTorch", "Flask", "Python"],
    icon: "🚁",
    useCase: "Airfield & airport runway anti-collision safety, critical infrastructure perimeter security, UAV counter-surveillance, and aerial wildlife tracking.",
    pros: [
      "Real-time high FPS object inference on 1080p aerial and drone video streams.",
      "Accurate multi-class differentiation between avian flight dynamics and quadcopter drones.",
      "Automated perimeter breach alert triggers with localized bounding box coordinates."
    ],
    cons: [
      "Inference confidence decreases under dense fog, heavy rain, or low-light night conditions.",
      "Requires hardware edge GPU (NVIDIA CUDA / Jetson) for concurrent multi-camera 4K processing."
    ],
  },
  {
    name: "ai-cyberpunk-portfolio",
    description: "Production full-stack portfolio integrating React 19, 3D WebGL shaders, Django REST API, agentic LLM with live Tavily web grounding, and OTP-verified messaging.",
    stars: 28,
    forks: 7,
    language: "React",
    category: "Full-Stack / AI",
    tech: ["React 19", "Three.js", "Django REST", "NVIDIA NIM", "Tavily AI", "Resend"],
    icon: "🌸",
    useCase: "Autonomous 24/7 technical recruiter pair-programming guide, zero-hallucination verified talent inquiry, and interactive 3D WebGL physics portfolio.",
    pros: [
      "Agentic multi-provider AI engine grounded with real-time web search and Bloom filter caching.",
      "Cinematic stance-reactive 3D Momiji leaf particle physics and sumi-e calligraphy brush strokes.",
      "End-to-end 6-digit OTP delivery handshake via Resend custom domain protocol."
    ],
    cons: [
      "Initial 3D WebGL shader assets require modern WebGL2 hardware graphics support.",
      "Upstream LLM inference response times are dependent on third-party cloud API latency."
    ],
  },
  {
    name: "Footfall-Counter",
    description: "Smart computer vision crowd analytics and directional footfall tracking engine utilizing YOLOv8 and centroid tracking algorithms.",
    stars: 8,
    forks: 2,
    language: "Python",
    category: "AI / Vision",
    tech: ["Python", "YOLOv8", "OpenCV", "Centroid Tracker", "NumPy"],
    icon: "👥",
    useCase: "Retail store foot-traffic optimization, public transit hub occupancy compliance, emergency evacuation headcount, and smart building management.",
    pros: [
      "Bidirectional counting (Entry vs Exit) with virtual tripwire line-crossing logic.",
      "Privacy-first architecture tracking vector centroids without facial recognition storage.",
      "Optimized for low-power edge processors and standard IP/CCTV RTSP streams."
    ],
    cons: [
      "Extremely dense crowd overlaps can occasionally cause temporary tracker ID swaps.",
      "Requires calibrated overhead or 45-degree camera mounting angles for peak counting accuracy."
    ],
  },
  {
    name: "patholedetection",
    description: "AI-driven road surface condition analysis and pothole hazard detection system using deep learning bounding box regression and automated road inspection.",
    stars: 15,
    forks: 4,
    language: "Python",
    category: "AI / Vision",
    tech: ["Python", "YOLO", "OpenCV", "React", "GIS Mapping"],
    icon: "🛣️",
    useCase: "Municipal road infrastructure maintenance, automated highway audits, fleet vehicle damage prevention, and smart city GIS road mapping.",
    pros: [
      "Automates road damage logging, eliminating expensive manual physical inspections.",
      "Real-time severity classification (shallow vs deep hazardous potholes).",
      "Ready for municipal dashcam integration and geo-tagged damage reporting."
    ],
    cons: [
      "Detection rate can drop under wet road conditions with heavy puddle water reflections.",
      "Requires vehicle mount stabilization to eliminate high-speed camera motion blur."
    ],
  },
  {
    name: "SVSS13",
    description: "Automated developer hub and continuous profile telemetry suite utilizing GitHub Actions for live stats aggregation and open-source contributions.",
    stars: 5,
    forks: 1,
    language: "Markdown",
    category: "DevOps / Tools",
    tech: ["GitHub Actions", "CI/CD Workflows", "Markdown", "SVG Analytics"],
    icon: "⚡",
    useCase: "Centralized developer presence, automated CI/CD pipeline health monitoring, and live metric tracking for engineering portfolios.",
    pros: [
      "Automated scheduled cron workflows updating contribution streak data and badges.",
      "Modular SVG status cards that render seamlessly across dark and light themes.",
      "Zero maintenance once configured with GitHub OAuth tokens."
    ],
    cons: [
      "Subject to standard GitHub API rate limits if third-party badge scrapers flood requests.",
      "Static presentation layer without dynamic client-side filtering."
    ],
  },
  {
    name: "react-projects",
    description: "Modular component engineering laboratory featuring custom React hooks, micro-interactions, state management architectures, and UI experiments.",
    stars: 3,
    forks: 0,
    language: "React",
    category: "Full-Stack / AI",
    tech: ["React", "JavaScript", "CSS Modules", "Vite"],
    icon: "⚛️",
    useCase: "Rapid UI prototyping sandbox, reusable frontend hook reference library, and battle-testing responsive component patterns.",
    pros: [
      "Plug-and-play isolated component architecture for rapid integration into larger apps.",
      "Zero heavyweight third-party UI framework dependencies.",
      "High testability with modular state hooks and accessible DOM structures."
    ],
    cons: [
      "Organized as an experimental playground rather than a single unified monolithic app.",
      "Varied styling conventions across different prototype modules."
    ],
  },
];

const langColors = {
  Python: "#3776AB",
  React: "#61DAFB",
  Markdown: "#E8503A",
  HTML: "#E34F26",
  JavaScript: "#F7DF1E",
};

const CATEGORIES = ["All", "AI / Vision", "Full-Stack / AI", "DevOps / Tools"];

const VP = { once: true, amount: 0.05 };

export default function GitHubStats() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const totalStars = repos.reduce((a, r) => a + r.stars, 0);
  const totalForks = repos.reduce((a, r) => a + r.forks, 0);

  const filteredRepos = selectedCategory === "All"
    ? repos
    : repos.filter(r => r.category === selectedCategory);

  return (
    <section id="github" className="section" style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", boxSizing: "border-box" }}>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VP}
        style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--sakura)", marginBottom: 8 }}
      >
        // CODE REPOSITORIES & ENGINEERING AUDIT
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ delay: 0.05 }}
        className="section-title"
      >
        GitHub <span className="neon-cyan">Repositories</span> & Deep Analysis
      </motion.h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "28px", maxWidth: "780px", lineHeight: 1.6 }}>
        Comprehensive breakdown of key open-source repositories from <a href="https://github.com/SVSS13" target="_blank" rel="noopener noreferrer" style={{ color: "var(--sakura)", fontWeight: 700, textDecoration: "none" }}>@SVSS13</a>, evaluating practical real-world utility, architecture strengths, and engineering trade-offs.
      </p>

      {/* Summary KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--gap)", marginBottom: "24px" }}>
        {[
          { label: "Active Repositories", value: repos.length, icon: "📁", sub: "Production codebases" },
          { label: "Total Stars", value: totalStars, icon: "★", sub: "Community stars" },
          { label: "Total Forks", value: totalForks, icon: "⑂", sub: "Open-source forks" },
          { label: "Primary Focus", value: "AI & CV", icon: "🧠", sub: "Computer Vision & ML" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass-card-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VP}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            style={{ textAlign: "center", padding: "18px 14px" }}
          >
            <div style={{ fontSize: "1.3rem", marginBottom: "4px" }}>{stat.icon}</div>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--sakura)", letterSpacing: "-0.04em" }}>{stat.value}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-primary)", fontWeight: 700, marginTop: "2px" }}>{stat.label}</div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "2px" }}>{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginRight: "6px" }}>Filter:</span>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: "50px",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              border: selectedCategory === cat ? "1px solid var(--sakura)" : "1px solid var(--glass-border)",
              background: selectedCategory === cat ? "linear-gradient(135deg, rgba(255,183,197,0.22), rgba(204,34,51,0.22))" : "rgba(255,255,255,0.04)",
              color: selectedCategory === cat ? "var(--sakura)" : "var(--text-secondary)",
              boxShadow: selectedCategory === cat ? "0 0 14px rgba(255,183,197,0.3)" : "none",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Detailed Repository Bento Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: "22px", marginBottom: "32px" }}>
        <AnimatePresence mode="popLayout">
          {filteredRepos.map((repo, i) => (
            <motion.div
              key={repo.name}
              layout
              className="glass-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              viewport={VP}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                padding: "clamp(20px, 3.5vw, 26px)",
                boxSizing: "border-box",
                width: "100%",
              }}
            >
              {/* Header: Icon, Name, GitHub Link, Stars/Forks */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>{repo.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <a
                      href={`https://github.com/SVSS13/${repo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "clamp(0.95rem, 2.5vw, 1.08rem)",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        textDecoration: "none",
                        letterSpacing: "-0.02em",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        wordBreak: "break-word",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--sakura)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
                    >
                      {repo.name} <FaExternalLinkAlt style={{ fontSize: "0.72rem", opacity: 0.7 }} />
                    </a>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.7rem", color: langColors[repo.language] || "var(--text-muted)", fontWeight: 700 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: langColors[repo.language] || "#888" }} />
                        {repo.language}
                      </span>
                      <span className="badge badge-gold" style={{ fontSize: "0.65rem", padding: "2px 7px" }}>
                        {repo.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.78rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "10px", border: "1px solid var(--glass-border)", flexShrink: 0 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><FaStar style={{ color: "#FFD700" }} /> {repo.stars}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><FaCodeBranch /> {repo.forks}</span>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {repo.description}
              </p>

              {/* Tech Stack Pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {repo.tech.map(t => (
                  <span key={t} className="tag" style={{ fontSize: "0.7rem", padding: "3px 8px" }}>{t}</span>
                ))}
              </div>

              {/* 💡 How It's Useful / Practical Value */}
              <div style={{
                background: "rgba(212,175,55,0.07)",
                border: "1px solid rgba(212,175,55,0.22)",
                borderRadius: "12px",
                padding: "10px 14px",
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
              }}>
                <FaLightbulb style={{ color: "#FFD700", fontSize: "0.95rem", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "2px" }}>
                    How It's Useful (Real-World Impact)
                  </span>
                  <p style={{ fontSize: "0.8rem", color: "var(--text)", lineHeight: 1.5, margin: 0 }}>
                    {repo.useCase}
                  </p>
                </div>
              </div>

              {/* Pros & Cons Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "2px" }} className="pros-cons-grid">
                {/* Pros */}
                <div style={{
                  background: "rgba(126,200,160,0.06)",
                  border: "1px solid rgba(126,200,160,0.2)",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", fontWeight: 800, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    <FaCheckCircle style={{ fontSize: "0.8rem" }} /> Key Strengths (Pros)
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "5px" }}>
                    {repo.pros.map((pro, pIdx) => (
                      <li key={pIdx} style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.45, display: "flex", alignItems: "flex-start", gap: "6px" }}>
                        <span style={{ color: "var(--green)", fontWeight: 800, lineHeight: 1 }}>+</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons / Trade-offs */}
                <div style={{
                  background: "rgba(204,34,51,0.06)",
                  border: "1px solid rgba(204,34,51,0.2)",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", fontWeight: 800, color: "#FF8DA1", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    <FaExclamationTriangle style={{ fontSize: "0.8rem" }} /> Trade-offs & Limits (Cons)
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "5px" }}>
                    {repo.cons.map((con, cIdx) => (
                      <li key={cIdx} style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.45, display: "flex", alignItems: "flex-start", gap: "6px" }}>
                        <span style={{ color: "#FF8DA1", fontWeight: 800, lineHeight: 1 }}>–</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: "auto", paddingTop: "6px" }}>
                <a
                  href={`https://github.com/SVSS13/${repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    fontSize: "0.78rem",
                    padding: "8px 16px",
                    boxSizing: "border-box",
                  }}
                >
                  <FaGithub style={{ fontSize: "0.9rem" }} /> View Repository & Source Code ↗
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Profile CTA */}
      <div style={{ textAlign: "center", padding: "12px 0" }}>
        <a
          href="https://github.com/SVSS13"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ fontSize: "0.88rem", padding: "12px 28px" }}
        >
          <FaGithub style={{ fontSize: "1.1rem" }} /> Explore All Repositories on GitHub (@SVSS13) →
        </a>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .pros-cons-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}

