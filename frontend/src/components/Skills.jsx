import { motion } from "framer-motion";

const categories = [
  {
    title: "Languages",
    icon: "{ }",
    skills: ["Python", "JavaScript", "C", "SQL", "MATLAB", "HTML/CSS"],
  },
  {
    title: "Frameworks & Libraries",
    icon: "⚙",
    skills: ["React", "Django", "REST API", "scikit-learn", "OpenCV", "TensorFlow", "PyTorch"],
  },
  {
    title: "DevOps & Cloud",
    icon: "☁",
    skills: ["Docker", "Jenkins", "AWS", "GitHub Actions", "Linux", "Nginx", "CI/CD"],
  },
  {
    title: "AI & ML",
    icon: "🧠",
    skills: ["Machine Learning", "YOLOv8", "Image Processing", "NLP", "RAG", "LLMs"],
  },
  {
    title: "Databases",
    icon: "🗄",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"],
  },
  {
    title: "Tools & Methods",
    icon: "🛠",
    skills: ["Git", "Agile / Scrum", "Figma", "VS Code", "Postman", "Jira"],
  },
];

const proficiency = [
  { name: "Python",    pct: 95 },
  { name: "Django",    pct: 90 },
  { name: "React",     pct: 88 },
  { name: "DevOps",    pct: 85 },
  { name: "Docker",    pct: 82 },
  { name: "ML / AI",   pct: 87 },
  { name: "AWS",       pct: 75 },
  { name: "Agile",     pct: 90 },
];

function Skills() {
  return (
    <section id="skills" className="section">
      <h2 className="section-title">Skills & Technologies</h2>

      {/* Category cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--gap)", marginBottom: "24px" }}>
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            className="bento-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span style={{ fontSize: "1.1rem", color: "var(--accent)" }}>{cat.icon}</span>
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
        className="bento-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "20px" }}>
          Proficiency Overview
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px 32px" }}>
          {proficiency.map((s, i) => (
            <div key={s.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 700 }}>{s.pct}%</span>
              </div>
              <div style={{ height: "6px", background: "var(--tag-bg)", borderRadius: "100px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.0, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: "100%", background: "var(--accent)", borderRadius: "100px" }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Skills;
