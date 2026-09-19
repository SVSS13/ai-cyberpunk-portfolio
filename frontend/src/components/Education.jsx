import { motion } from "framer-motion";
import { useFileInspector } from "../context/FileInspectorContext";
import { FaShieldAlt, FaCheckCircle, FaQrcode, FaFilePdf, FaExternalLinkAlt } from "react-icons/fa";
import dsuLogo from "../assets/dsu_logo.png";
import narayanaLogo from "../assets/narayana_logo.png";
import adityaBirlaLogo from "../assets/aditya_birla_logo.png";

const education = [
  {
    logo: dsuLogo,
    title: "B.Tech in Computer Science & Engineering",
    institute: "Dayananda Sagar University",
    location: "Bengaluru, India",
    duration: "2022 – Oct 2026 (Grad: Oct 28)",
    score: "CGPA: 7.85",
    description: "Specializing in Cloud Observability, Backend Pipeline Engineering, Artificial Intelligence, Automated Anomaly Detection, and Scalable Full-Stack Systems.",
    current: true,
  },
  {
    logo: narayanaLogo,
    title: "Class XII — Senior Secondary (State Board)",
    institute: "The Narayana Institutions",
    location: "Bengaluru, India",
    duration: "2020 – 2022",
    score: "79%",
    description: "Completed higher secondary education with focus on analytical problem-solving, mathematics, physics, and computer science foundations.",
    current: false,
  },
  {
    logo: adityaBirlaLogo,
    title: "Class X — Secondary School (CBSE)",
    institute: "Aditya Birla Public School",
    location: "Karnataka, India",
    duration: "2012 – 2020",
    score: "72%",
    description: "Built strong academic foundations in science, mathematics, and computing while actively developing leadership and analytical interests.",
    current: false,
  },
];

const certifications = [
  {
    id: "nasa-space-apps",
    title: "Galactic Problem Solver",
    issuer: "NASA Space Apps Challenge 2024",
    icon: "🚀",
    badge: "Verified NASA Honor",
    hasPdfs: false,
    detail: "Awarded Galactic Problem Solver credential for capstone innovation at NASA Space Apps 2024.",
  },
  {
    id: "linux-foundation",
    title: "TechA Linux Foundation Certification",
    issuer: "Infosys Springboard",
    icon: "🐧",
    badge: "2 Verified PDFs + QR",
    hasPdfs: true,
    detail: "Linux Bash Scripting & Shell Programming · Official QR at https://verify.onwingspan.com",
  },
  {
    id: "jenkins-cicd",
    title: "Practical Jenkins CI/CD Certification",
    issuer: "Infosys Springboard",
    icon: "⚙️",
    badge: "Verified DevOps",
    hasPdfs: false,
    detail: "Continuous Integration & Delivery pipeline automation accreditation.",
  },
  {
    id: "scrum-foundation",
    title: "Scrum Foundation: Scrum in Action",
    issuer: "Infosys Springboard",
    icon: "📋",
    badge: "Verified Agile",
    hasPdfs: false,
    detail: "Agile Scrum sprint delivery & product backlog optimization.",
  },
  {
    id: "matlab-onramp",
    title: "MATLAB Onramp (100% Verified)",
    issuer: "MathWorks Training",
    icon: "🔬",
    badge: "2 Verified PDFs",
    hasPdfs: true,
    detail: "100% Verified in Image Processing with MATLAB & Computer Vision Onramp.",
  },
  {
    id: "ea-product-management",
    title: "Product Management Simulation (KPIs)",
    issuer: "Electronic Arts / Forage",
    icon: "🎮",
    badge: "Industry Simulation",
    hasPdfs: false,
    detail: "Product feature prioritization, KPI metrics tracking & launch strategy simulation for Electronic Arts.",
  },
];

const VP = { once: true, amount: 0.05 };

export default function Education() {
  const { openAtsModal, openCertModal } = useFileInspector();

  return (
    <section id="education" className="section">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VP}
        style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--sakura)", marginBottom: 8 }}
      >
        // ACADEMIC PATHWAY & CREDENTIALS
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ delay: 0.05 }}
        className="section-title"
      >
        Education & <span className="neon-gold">Certifications</span>
      </motion.h2>

      {/* Timeline */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "var(--gap)", marginBottom: "40px" }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute",
          left: "26px",
          top: 0,
          bottom: 0,
          width: "2px",
          background: "linear-gradient(to bottom, var(--crimson), var(--sakura))",
          boxShadow: "0 0 8px rgba(204,34,51,0.4)",
        }} />

        {education.map((edu, i) => (
          <motion.div
            key={edu.title}
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
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
              background: edu.current ? "var(--sakura)" : "var(--crimson)",
              border: `3px solid ${edu.current ? "rgba(255,183,197,0.4)" : "var(--bg)"}`,
              boxShadow: edu.current ? "0 0 12px rgba(255,183,197,0.6)" : "none",
            }} />

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
              {/* Institutional Logo */}
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid var(--glass-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px",
                flexShrink: 0,
                boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              }}>
                <img
                  src={edu.logo}
                  alt={edu.institute}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "6px",
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: "240px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>{edu.title}</h3>
                  {edu.current && (
                    <span className="badge badge-green" style={{ fontSize: "0.7rem" }}>Current (Grad: Oct 2026)</span>
                  )}
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--sakura)", fontWeight: 600, marginBottom: "8px" }}>
                  {edu.institute} <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>· {edu.location}</span>
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "14px" }}>
                  {edu.description}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span className="tag">{edu.duration}</span>
                  <span className="tag tag-gold">{edu.score}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Verified Certifications Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ delay: 0.2 }}
        className="glass-card"
        style={{ padding: "24px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
              🏆 Professional Certifications & Accreditations
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Click any credential below to open the interactive PDF viewer and verify authenticity via embedded QR codes & SHA-256 signatures.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="badge badge-green" style={{ fontSize: "0.7rem" }}>6 Verified Credentials</span>
            <button
              onClick={openAtsModal}
              title="Inspect live cryptographic authenticity and certificate verification"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255, 215, 0, 0.12)",
                border: "1px solid rgba(255, 215, 0, 0.35)",
                color: "var(--gold)",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "0.72rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <FaShieldAlt /> Inspect Authenticity
            </button>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: "14px",
          width: "100%",
          boxSizing: "border-box",
        }}>
          {certifications.map((cert) => (
            <motion.div
              key={cert.title}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => openCertModal(cert.id || cert)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openCertModal(cert.id || cert);
                }
              }}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--glass-border)",
                borderRadius: "14px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "14px",
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                boxSizing: "border-box",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.45)";
                e.currentTarget.style.background = "rgba(255, 215, 0, 0.05)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 215, 0, 0.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--glass-border)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.25)";
              }}
            >
              {/* Top Section: Icon & Full Title & Issuer */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", width: "100%" }}>
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid var(--glass-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.35rem",
                  flexShrink: 0,
                  marginTop: "2px",
                }}>
                  {cert.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1.4,
                    margin: "0 0 6px 0",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    letterSpacing: "-0.01em",
                  }}>
                    {cert.title}
                  </h4>
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--sakura)", fontWeight: 600 }}>
                      ✓ {cert.issuer}
                    </span>
                    {cert.hasPdfs && (
                      <span style={{
                        fontSize: "0.65rem",
                        color: "var(--gold)",
                        background: "rgba(255,215,0,0.15)",
                        border: "1px solid rgba(255,215,0,0.3)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                        fontWeight: 700,
                      }}>
                        <FaFilePdf /> PDF
                      </span>
                    )}
                  </div>
                  {cert.detail && (
                    <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: "6px 0 0 0", wordBreak: "break-word" }}>
                      {cert.detail}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Action / Verification Strip */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
                paddingTop: "10px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                width: "100%",
              }}>
                <span style={{
                  fontSize: "0.66rem",
                  color: "var(--green)",
                  fontWeight: 700,
                  background: "rgba(126,200,160,0.12)",
                  border: "1px solid rgba(126,200,160,0.3)",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}>
                  <FaCheckCircle /> {cert.badge}
                </span>
                <span style={{
                  fontSize: "0.72rem",
                  color: "var(--gold)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontWeight: 700,
                  background: "rgba(255,215,0,0.08)",
                  border: "1px solid rgba(255,215,0,0.25)",
                  padding: "3px 10px",
                  borderRadius: "6px",
                }}>
                  <FaQrcode style={{ fontSize: "0.68rem" }} /> View & Verify ↗
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
