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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
          {certifications.map((cert) => (
            <motion.div
              key={cert.title}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
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
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.4)";
                e.currentTarget.style.background = "rgba(255, 215, 0, 0.05)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 215, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--glass-border)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{cert.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {cert.title}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--sakura)", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span>✓ {cert.issuer}</span>
                    {cert.hasPdfs && (
                      <span style={{ fontSize: "0.62rem", color: "var(--gold)", background: "rgba(255,215,0,0.15)", padding: "1px 5px", borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                        <FaFilePdf /> PDF
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                <span style={{ fontSize: "0.62rem", color: "var(--green)", fontWeight: 700, background: "rgba(126,200,160,0.1)", border: "1px solid rgba(126,200,160,0.25)", padding: "2px 6px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "3px" }}>
                  <FaCheckCircle /> {cert.badge}
                </span>
                <span style={{ fontSize: "0.64rem", color: "var(--gold)", display: "flex", alignItems: "center", gap: "3px", fontWeight: 600 }}>
                  <FaQrcode style={{ fontSize: "0.6rem" }} /> View & Verify ↗
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
