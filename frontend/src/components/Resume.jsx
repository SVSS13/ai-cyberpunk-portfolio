import { motion } from "framer-motion";
import resumePdf from "../assets/resume.pdf";
import API from "../services/api";

const VP = { once: true, amount: 0.05 };

export default function Resume() {
  const handleDownload = async () => {
    try {
      await API.post("resume-download/");
    } catch (e) {
      console.warn("Resume tracking error:", e);
    }
    const downloadUrl = resumePdf || "/resume.pdf";
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "SVS_Sujal_Resume.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="resume" className="section">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VP}
        style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--sakura)", marginBottom: 8 }}
      >
        // CREDENTIALS & RÉSUMÉ
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ delay: 0.05 }}
        className="section-title"
      >
        Resume & <span className="neon-gold">Credentials</span>
      </motion.h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--gap)" }}>
        {/* Stats cards */}
        {[
          { value: "12+", label: "Technical Skills",   icon: "⚙" },
          { value: "4+",  label: "Major Projects",     icon: "🚀" },
          { value: "AI",  label: "Primary Focus Area", icon: "🧠" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="glass-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            style={{ textAlign: "center", padding: "32px" }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-0.06em", color: "var(--sakura)" }}>{s.value}</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px", fontWeight: 600 }}>{s.label}</div>
          </motion.div>
        ))}

        {/* Download card — full width */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
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
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--sakura)", textTransform: "uppercase", marginBottom: "6px" }}>
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
            className="btn-primary"
            onClick={handleDownload}
            style={{ flexShrink: 0 }}
          >
            ⬇ Download Resume
          </button>
        </motion.div>
      </div>
    </section>
  );
}
