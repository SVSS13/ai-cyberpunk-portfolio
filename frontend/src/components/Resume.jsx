import { motion } from "framer-motion";
import resumePdf from "../assets/resume.pdf";
import API from "../services/api";
import { useFileInspector } from "../context/FileInspectorContext";
import { FaEye, FaDownload, FaBolt, FaShieldAlt } from "react-icons/fa";

const VP = { once: true, amount: 0.05 };

export default function Resume() {
  const { openFile, openAtsModal } = useFileInspector();

  const handleDownload = async () => {
    try {
      await API.post("resume-download/");
    } catch (e) {
      console.warn("Resume tracking error:", e);
    }
    const downloadUrl = resumePdf || "/resume.pdf";
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "SVS_Sujal_CV.pdf";
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
        // CREDENTIALS & CV
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ delay: 0.05 }}
        className="section-title"
      >
        CV & <span className="neon-gold">Credentials</span>
      </motion.h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--gap)" }}>
        {/* Stats cards */}
        {[
          {
            value: "97/100",
            label: "ATS Score (Verified A+)",
            icon: "⚡",
            badge: "Top 1%",
            highlight: true,
            action: openAtsModal,
          },
          { value: "12+", label: "Technical Skills",   icon: "⚙" },
          { value: "4+",  label: "Major Projects",     icon: "🚀" },
          { value: "AI & Cloud", label: "Primary Focus Area", icon: "🧠" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="glass-card"
            onClick={s.action ? s.action : undefined}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            style={{
              textAlign: "center",
              padding: "32px",
              cursor: s.action ? "pointer" : "default",
              position: "relative",
              border: s.highlight ? "1px solid rgba(255, 215, 0, 0.35)" : undefined,
              background: s.highlight ? "rgba(255, 215, 0, 0.04)" : undefined,
            }}
          >
            {s.badge && (
              <span
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "rgba(255,215,0,0.15)",
                  color: "var(--gold)",
                  border: "1px solid rgba(255,215,0,0.3)",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "100px",
                  letterSpacing: "0.05em",
                }}
              >
                {s.badge}
              </span>
            )}
            <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-0.06em", color: s.highlight ? "var(--gold)" : "var(--sakura)" }}>
              {s.value}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px", fontWeight: 600 }}>
              {s.label}
              {s.action && (
                <span style={{ display: "block", fontSize: "0.68rem", color: "var(--gold)", marginTop: "4px" }}>
                  Click to Run Live ATS Audit →
                </span>
              )}
            </div>
          </motion.div>
        ))}

        {/* Download & Fullscreen Inspect Card */}
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
              CV Inspection & Live ATS Audit
            </p>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
              Interactive CV PDF Viewer & Real-Time Evaluator
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Inspect credentials in full-screen window popup, run an authentic real-time ATS audit, or download a direct PDF copy.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="btn-primary"
              onClick={openAtsModal}
              style={{
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                color: "#000",
                fontWeight: 800,
                boxShadow: "0 0 15px rgba(255, 215, 0, 0.35)",
              }}
            >
              <FaBolt /> Run Live ATS Audit
            </button>
            <button
              className="btn-ghost"
              onClick={() => openFile('cv')}
              style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <FaEye /> Inspect Full Screen
            </button>
            <button
              className="btn-ghost"
              onClick={handleDownload}
              style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <FaDownload /> Download CV
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
