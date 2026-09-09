import { motion } from "framer-motion";

const education = [
  {
    icon: "🎓",
    title: "Bachelor's in Computing Science & Engineering",
    institute: "Dayananda Sagar University",
    duration: "2022 – 2026",
    score: "CGPA: 7.85",
    description: "Focused on Artificial Intelligence, DevOps, Cloud Computing, Agile Methodologies, Full Stack Development and Digital Systems Engineering.",
    current: true,
  },
  {
    icon: "🏫",
    title: "Class XII — Science (PCM + CS)",
    institute: "The Narayana Institutions",
    duration: "2020 – 2022",
    score: "79%",
    description: "Completed higher secondary education with focus on analytical problem-solving, mathematics and computer science foundations.",
    current: false,
  },
  {
    icon: "🏫",
    title: "Class X",
    institute: "The Aditya Birla Public School",
    duration: "2012 – 2020",
    score: "72%",
    description: "Built strong academic foundations while actively developing communication, leadership and technical interests.",
    current: false,
  },
];

function Education() {
  return (
    <section id="education" className="section">
      <h2 className="section-title">Education</h2>

      {/* Timeline */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute",
          left: "26px",
          top: 0,
          bottom: 0,
          width: "2px",
          background: "var(--card-border)",
        }} />

        {education.map((edu, i) => (
          <motion.div
            key={edu.title}
            className="bento-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ marginLeft: "52px", position: "relative" }}
          >
            {/* Timeline dot */}
            <div style={{
              position: "absolute",
              left: "-39px",
              top: "24px",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: edu.current ? "var(--accent)" : "var(--card-border)",
              border: `3px solid ${edu.current ? "rgba(255,107,53,0.2)" : "var(--bg)"}`,
              boxShadow: edu.current ? "0 0 0 4px rgba(255,107,53,0.15)" : "none",
            }} />

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>{edu.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>{edu.title}</h3>
                  {edu.current && (
                    <span className="tag tag-accent" style={{ fontSize: "0.7rem" }}>Current</span>
                  )}
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600, marginBottom: "8px" }}>
                  {edu.institute}
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "14px" }}>
                  {edu.description}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span className="tag">{edu.duration}</span>
                  <span className="tag tag-accent">{edu.score}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Education;
