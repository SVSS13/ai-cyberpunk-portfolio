import { motion } from "framer-motion";

function Resume() {
  return (
    <section id="resume" className="section">
      <h2 className="section-title">Resume & Credentials</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--gap)" }}>

        {/* Stats cards */}
        {[
          { value: "12+", label: "Technical Skills",     icon: "⚙" },
          { value: "4+",  label: "Major Projects",       icon: "🚀" },
          { value: "AI",  label: "Primary Focus Area",   icon: "🧠" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="bento-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            style={{ textAlign: "center", padding: "32px" }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-0.06em", color: "var(--accent)" }}>{s.value}</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px", fontWeight: 500 }}>{s.label}</div>
          </motion.div>
        ))}

        {/* Download card — full width */}
        <motion.div
          className="bento-card"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
              Resume
            </p>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
              Download My Resume
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Full professional profile including skills, projects, certifications and experience.
            </p>
          </div>
          <button
            className="btn-accent"
            onClick={() => alert("Resume download would trigger here — add your PDF link!")}
            style={{ flexShrink: 0 }}
          >
            ⬇ Download Resume
          </button>
        </motion.div>

      </div>
    </section>
  );
}

export default Resume;
