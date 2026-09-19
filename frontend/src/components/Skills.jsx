import { motion } from "framer-motion";

const categories = [
  {
    title: "Cloud & Observability",
    icon: "☁",
    skills: ["AWS CloudWatch Logs", "CloudWatch Metrics", "Alarms", "AWS EC2", "Linux / Unix", "Telemetry Aggregation"],
  },
  {
    title: "Languages & Scripting",
    icon: "{ }",
    skills: ["Python", "SQL (PostgreSQL, MySQL)", "Bash / Shell", "Java", "C", "R", "JavaScript"],
  },
  {
    title: "DevOps & Infrastructure",
    icon: "⚙",
    skills: ["Docker", "Jenkins", "Git", "GitHub Actions", "Ansible", "Power BI", "Nginx", "CI/CD"],
  },
  {
    title: "Frameworks & Databases",
    icon: "🗄",
    skills: ["Django", "Flask", "FastAPI", "React", "Node.js", "PostgreSQL", "MySQL", "MongoDB", "REST APIs"],
  },
  {
    title: "AI, Vision & Methods",
    icon: "🧠",
    skills: ["Anomaly Detection", "YOLOv8", "OpenCV", "Groq LLM API", "MobileNetV2", "Agile / Scrum"],
  },
];

const proficiency = [
  { name: "Cloud Observability & AWS", pct: 96 },
  { name: "Python & Backend Systems",   pct: 95 },
  { name: "SQL & Data Ingestion",      pct: 94 },
  { name: "Docker & Jenkins CI/CD",    pct: 90 },
  { name: "Django & REST APIs",        pct: 92 },
  { name: "Computer Vision & YOLOv8",  pct: 91 },
  { name: "Linux Administration",      pct: 93 },
  { name: "Scheduled Anomaly Detection", pct: 95 },
];

const VP = { once: true, amount: 0.05 };

export default function Skills() {
  return (
    <section id="skills" className="section">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VP}
        style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--sakura)", marginBottom: 8 }}
      >
        // ARSENAL & TECH
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ delay: 0.05 }}
        className="section-title"
      >
        Skills & <span className="neon-violet">Technologies</span>
      </motion.h2>

      {/* Category cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--gap)", marginBottom: "24px" }}>
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span style={{ fontSize: "1.1rem", color: "var(--sakura)" }}>{cat.icon}</span>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase" }}>
                {cat.title}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {cat.skills.map((s) => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Proficiency bars */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 0.5 }}
      >
        <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--sakura)", textTransform: "uppercase", marginBottom: "20px" }}>
          Proficiency Overview
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px 32px" }}>
          {proficiency.map((s, i) => (
            <div key={s.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--sakura)", fontWeight: 700 }}>{s.pct}%</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.pct}%` }}
                  viewport={VP}
                  transition={{ duration: 1.0, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, var(--crimson), var(--sakura))",
                    boxShadow: "0 0 8px rgba(255,183,197,0.4)",
                    borderRadius: "100px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
