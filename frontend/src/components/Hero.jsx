import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../App";
import profilePhoto from "../assets/profile.png";

// Live clock
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
          fontSize: "2.5rem",
          fontWeight: 800,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          color: "var(--text-primary)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {h}:{m}:{s}
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "6px", fontWeight: 500 }}>
        {day}
      </div>
    </div>
  );
}

const CARD = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] } }),
};

function Hero() {
  const { dark, toggle } = useTheme();

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

        {/* ── Card 1: Hero Text (col 1-8, row 1) ── */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={CARD}
          className="bento-card"
          style={{ gridColumn: "span 8", gridRow: "span 2" }}
        >
          <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", minHeight: "220px" }}>
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
                Build Engineer · AI Enthusiast · Cloud Practitioner
              </p>
              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                color: "var(--text-primary)",
              }}>
                HELLO, I'M<br />
                <span style={{ color: "var(--accent)" }}>SVS SUJAL</span> 👋<br />
                Build Engineer +<br />
                AI Developer +<br />
                Cloud Practitioner.<br />
                <span style={{ color: "var(--text-muted)", fontSize: "75%", fontWeight: 700 }}>PROBABLY.</span>
              </h1>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "28px", flexWrap: "wrap" }}>
              <button
                className="btn-accent"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Let's Work Together →
              </button>
              <button
                className="btn-outline"
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              >
                View Projects
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Card 2: Status + Clock (col 9-12, row 1) ── */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={CARD}
          className="bento-card"
          style={{ gridColumn: "span 4" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: "100px",
                padding: "4px 12px",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--available-color)",
              }}
            >
              <span className="status-dot" /> AVAILABLE
            </span>
          </div>
          <Clock />
          <button
            onClick={toggle}
            style={{
              marginTop: "20px",
              background: "none",
              border: "1px solid var(--card-border)",
              borderRadius: "10px",
              padding: "8px 14px",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              width: "100%",
              textAlign: "left",
              transition: "all 0.2s",
            }}
          >
            {dark ? "☀ SWITCH TO LIGHT MODE" : "◗ SWITCH TO DARK MODE"}
          </button>
        </motion.div>

        {/* ── Card 3: Avatar (col 9-12, row 2) ── */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={CARD}
          className="bento-card"
          style={{
            gridColumn: "span 4",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            minHeight: "220px",
            overflow: "hidden",
            padding: "10px",
          }}
        >
          <img
            src={profilePhoto}
            alt="SVS Sujal"
            style={{
              width: "100%",
              height: "100%",
              minHeight: "200px",
              objectFit: "cover",
              objectPosition: "center top",
              borderRadius: "14px",
              display: "block",
            }}
          />
        </motion.div>

        {/* ── Card 4: Socials (col 1-4, row 3) ── */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={CARD}
          className="bento-card"
          style={{ gridColumn: "span 4" }}
        >
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "16px" }}>
            Socials
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "GitHub", sub: "@SVSS13", href: "https://github.com/SVSS13", icon: "⑂" },
              { label: "LinkedIn", sub: "/in/svss13", href: "https://www.linkedin.com/in/svss13", icon: "in" },
              { label: "Email", sub: "svss.officia13@gmail.com", href: "mailto:svss.officia13@gmail.com", icon: "✉" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "10px",
                  background: "var(--tag-bg)",
                  border: "1px solid var(--tag-border)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--tag-border)"; }}
              >
                <span style={{ fontSize: "0.9rem", width: "20px", textAlign: "center", color: "var(--accent)" }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.label}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{s.sub}</div>
                </div>
                <span style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: "0.8rem" }}>↗</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* ── Card 5: About snippet (col 5-8, row 3) ── */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={CARD}
          className="bento-card"
          style={{ gridColumn: "span 4" }}
        >
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>
            About
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Aspiring Build Engineer & Cloud platform geek. Passionate about AI systems, DevOps automation, and scalable full-stack solutions.
          </p>
          <button
            className="btn-outline"
            style={{ marginTop: "16px", fontSize: "0.78rem" }}
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          >
            Read more →
          </button>
        </motion.div>

        {/* ── Card 6: Tech Stack (col 9-12, row 3) ── */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={CARD}
          className="bento-card"
          style={{ gridColumn: "span 4" }}
        >
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "14px" }}>
            My Daily Stack
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {["Python","React","Django","Docker","AWS","Jenkins","MATLAB","OpenCV","Git","Linux"].map((tech) => (
              <span key={tech} className="tag">{tech}</span>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Mobile layout override */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid > * { grid-column: span 12 !important; }
        }
      `}</style>
    </section>
  );
}

export default Hero;
