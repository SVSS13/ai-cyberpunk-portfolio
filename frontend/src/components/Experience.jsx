import { motion } from "framer-motion";

const experiences = [
  {
    icon: "⚡",
    title: "Agile & Project Management",
    subtitle: "Methodologies & Leadership",
    description: "Experienced in Agile methodologies including Scrum, Lean, XP and Kanban. Strong collaboration, sprint planning, retrospectives, and cross-functional team leadership.",
    tags: ["Scrum", "Kanban", "Lean", "XP", "Jira", "Sprint Planning"],
  },
  {
    icon: "🐳",
    title: "DevOps & Automation",
    subtitle: "CI/CD, Containers & Pipelines",
    description: "Worked with Docker, Jenkins, and GitHub Actions to streamline CI/CD pipelines and deployment processes. Experienced in containerization, orchestration, and infrastructure automation.",
    tags: ["Docker", "Jenkins", "GitHub Actions", "CI/CD", "Linux", "Nginx"],
  },
  {
    icon: "🧠",
    title: "AI & Image Processing",
    subtitle: "Machine Learning & Computer Vision",
    description: "Built intelligent ML and image processing systems using Python, OpenCV, MATLAB, and scikit-learn. Experienced with YOLOv8, TensorFlow, PyTorch, and large language model integrations.",
    tags: ["YOLOv8", "OpenCV", "scikit-learn", "TensorFlow", "LLMs", "RAG"],
  },
];

function Experience() {
  return (
    <section id="experience" className="section">
      <h2 className="section-title">Experience & Expertise</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.title}
            className="bento-card"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              {/* Icon */}
              <div style={{
                flexShrink: 0,
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "rgba(255,107,53,0.1)",
                border: "1px solid rgba(255,107,53,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
              }}>
                {exp.icon}
              </div>
              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>{exp.title}</h3>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{exp.subtitle}</span>
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "14px" }}>
                  {exp.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {exp.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Experience;
