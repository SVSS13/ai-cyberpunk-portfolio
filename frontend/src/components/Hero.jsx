import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useStance } from "../context/StanceContext";
import { useFileInspector } from "../context/FileInspectorContext";
import resumePdf from "../assets/resume.pdf";
import API from "../services/api";
import { FaDownload, FaFileAlt, FaBriefcase, FaGraduationCap, FaEnvelope, FaBolt } from "react-icons/fa";
import profilePhoto from "../assets/profile.png";

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = time.getHours().toString().padStart(2, "0");
  const m = time.getMinutes().toString().padStart(2, "0");
  const s = time.getSeconds().toString().padStart(2, "0");
  const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][time.getDay()];

  return (
    <div>
      <div
        style={{
          fontSize: "2.2rem",
          fontWeight: 800,
          letterSpacing: "-0.05em",
          lineHeight: 1,
          color: "var(--sakura)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {h}:{m}:{s}
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "6px", fontWeight: 600 }}>
        {day}
      </div>
    </div>
  );
}

const CARD = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  const { stance } = useStance();
  const { openFile, openAtsModal } = useFileInspector();
  const cardRef = useRef(null);

  const handleDownloadResume = async () => {
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

  const onMouseMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) scale3d(1.02,1.02,1.02)`;
  };

  return (
    <section
      id="hero"
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        padding: "32px 24px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {/* ── Bento Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "auto",
          gap: "var(--gap)",
          width: "100%",
        }}
        className="hero-grid"
      >
        {/* ── Card 1: Hero Text (col 1-7, row 1) ── */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={CARD}
          className="glass-card"
          style={{ gridColumn: "span 7", gridRow: "span 2" }}
        >
          <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", minHeight: "240px" }}>
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--sakura)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
                AI Engineer · Full-Stack Developer · Computer Vision
              </p>
              <h1 style={{
                fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                color: "var(--text-primary)",
              }}>
                HELLO, I'M<br />
                <span className="neon-cyan">SVS SUJAL</span> 👋<br />
                <span style={{ fontSize: "0.85em", color: "var(--text-secondary)" }}>
                  <TypeAnimation
                    sequence={[
                      "AI Engineer +", 1800,
                      "Full-Stack Developer +", 1800,
                      "Computer Vision Engineer +", 1800,
                      "DevOps Engineer +", 1800,
                    ]}
                    repeat={Infinity}
                    style={{ display: "inline" }}
                  />
                </span>
                <br />
                <span style={{ color: "var(--text-muted)", fontSize: "75%", fontWeight: 700 }}>DEFINITELY.</span>
              </h1>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "28px", flexWrap: "wrap" }}>
              <button
                className="btn-primary"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Let's Work Together →
              </button>
              <button
                className="btn-ghost"
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              >
                View Projects ↗
              </button>
              <button
                className="btn-ghost"
                onClick={() => openFile('resume')}
                style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
              >
                📁 Inspect Resume
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Card 2: Recruiter Fast-Track & Executive Snapshot (col 8-12, row 1-2) ── */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={CARD}
          className="glass-card"
          style={{
            gridColumn: "span 5",
            gridRow: "span 2",
            padding: "clamp(18px, 3vw, 24px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, rgba(20,6,14,0.92), rgba(10,3,7,0.95))",
            border: "1px solid rgba(255,183,197,0.22)",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {/* Subtle Top Ambient Glow */}
          <div style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "140px",
            height: "140px",
            background: "radial-gradient(circle, rgba(255,183,197,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Header */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "6px" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--sakura)", letterSpacing: "0.14em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
                <FaBolt style={{ color: "#FFD700" }} /> RECRUITER FAST-TRACK
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                <span
                  onClick={openAtsModal}
                  title="Click to run live Neural ATS Audit & verify authenticity in real-time"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "rgba(255,215,0,0.12)",
                    border: "1px solid rgba(255,215,0,0.35)",
                    borderRadius: "100px",
                    padding: "3px 8px",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: "var(--gold)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  ⚡ Live ATS: 97/100
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "rgba(126,200,160,0.12)",
                    border: "1px solid rgba(126,200,160,0.3)",
                    borderRadius: "100px",
                    padding: "3px 10px",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "var(--green)",
                  }}
                >
                  <span className="status-dot" style={{ width: 6, height: 6 }} /> Available for Hire
                </span>
              </div>
            </div>

            {/* Current Position & Education Highlights */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
              {/* Role */}
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--glass-border)",
                borderRadius: "12px",
                padding: "10px 12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <FaBriefcase style={{ color: "var(--sakura)" }} /> Current Role
                </div>
                <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
                  Technology Intern
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                  Exdion Health (Exdion Solutions) · Healthcare AI & Pipeline Observability
                </div>
              </div>

              {/* Education */}
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--glass-border)",
                borderRadius: "12px",
                padding: "10px 12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <FaGraduationCap style={{ color: "var(--gold)" }} /> Education
                </div>
                <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
                  B.Tech in Computer Science & Eng.
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "1px", display: "flex", justifyContent: "space-between" }}>
                  <span>Dayananda Sagar University (DSU)</span>
                  <span style={{ color: "var(--gold)", fontWeight: 700 }}>CGPA: 7.85</span>
                </div>
              </div>
            </div>

            {/* Key Competencies Pills */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                Core Competencies
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {[
                  "Computer Vision",
                  "YOLOv8 & PyTorch",
                  "Agentic AI",
                  "React 19",
                  "Django REST",
                  "Docker & AWS",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="tag"
                    style={{ fontSize: "0.68rem", padding: "2px 8px" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                onClick={handleDownloadResume}
                className="btn-primary"
                style={{
                  fontSize: "0.78rem",
                  padding: "9px 12px",
                  justifyContent: "center",
                  borderRadius: "10px",
                }}
              >
                <FaDownload /> Resume PDF
              </button>
              <button
                onClick={() => openFile("resume")}
                className="btn-ghost"
                style={{
                  fontSize: "0.78rem",
                  padding: "9px 12px",
                  justifyContent: "center",
                  borderRadius: "10px",
                }}
              >
                <FaFileAlt /> Inspect Full
              </button>
            </div>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-ghost"
              style={{
                fontSize: "0.78rem",
                padding: "8px 12px",
                justifyContent: "center",
                borderRadius: "10px",
                borderColor: "rgba(255,183,197,0.3)",
                color: "var(--sakura)",
              }}
            >
              <FaEnvelope /> Contact Directly (OTP Verified) →
            </button>
          </div>
        </motion.div>

        {/* ── Card 3: Status + Clock (col 1-4, row 3) ── */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={CARD}
          className="glass-card"
          style={{ gridColumn: "span 4" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(126,200,160,0.12)",
                border: "1px solid rgba(126,200,160,0.3)",
                borderRadius: "100px",
                padding: "4px 12px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--green)",
              }}
            >
              <span className="status-dot" /> AVAILABLE
            </span>
          </div>
          <Clock />
        </motion.div>

        {/* ── Card 4: Holographic Profile Avatar (col 5-8, row 3) ── */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={CARD}
          className="glass-card"
          style={{
            gridColumn: "span 4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "180px",
            overflow: "hidden",
            padding: "10px",
          }}
        >
          <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={() => { if (cardRef.current) cardRef.current.style.transform = "perspective(800px) rotateY(0) rotateX(0)"; }}
            style={{ width: "100%", height: "100%", transition: "transform 0.18s ease", willChange: "transform" }}
          >
            <div style={{ width: "100%", height: "100%", minHeight: "160px", position: "relative", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255, 183, 197, 0.25)" }}>
              <img
                src={profilePhoto}
                alt="SVS Sujal"
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "160px",
                  objectFit: "cover",
                  objectPosition: "center top",
                  borderRadius: "14px",
                  display: "block",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Card 5: Socials (col 9-12, row 3) ── */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={CARD}
          className="glass-card"
          style={{ gridColumn: "span 4" }}
        >
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "14px" }}>
            Socials
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { label: "GitHub", sub: "@SVSS13", href: "https://github.com/SVSS13", icon: "⑂" },
              { label: "LinkedIn", sub: "/in/svss13", href: "https://www.linkedin.com/in/svss13", icon: "in" },
              { label: "Email", sub: "svss.officia13@gmail.com", href: "mailto:svss.officia13@gmail.com", icon: "✉" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "7px 12px",
                  borderRadius: "10px",
                  background: "rgba(255,183,197,0.05)",
                  border: "1px solid var(--glass-border)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--sakura)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--glass-border)")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--sakura)", fontSize: "0.85rem", width: "16px", textAlign: "center" }}>
                    {s.icon}
                  </span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    {s.label}
                  </span>
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {s.sub}
                </span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* ── Card 6: Daily Tech Stack (col 1-12, row 4) ── */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={CARD}
          className="glass-card"
          style={{ gridColumn: "span 12" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--sakura)", textTransform: "uppercase", marginBottom: "4px" }}>
                Daily Weaponry & Technologies
              </p>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Core Engineering Stack
              </h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["Python", "React 19", "Three.js", "Django REST", "YOLOv8", "OpenCV", "Docker", "AWS", "Git"].map((tech) => (
                <span key={tech} className="tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-grid > div {
            grid-column: span 1 !important;
            grid-row: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
