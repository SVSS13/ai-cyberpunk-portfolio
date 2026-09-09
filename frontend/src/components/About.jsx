import { motion } from "framer-motion";
import profilePhoto from "../assets/profile.png";

const interests = [
  "Artificial Intelligence", "DevOps", "Cloud Computing",
  "Full-Stack Development", "Agile / Scrum", "Image Processing",
  "Open Source", "System Design", "Linux",
];

const VP = { once: true, amount: 0.1 };

export default function About() {
  return (
    <section id="about" className="section">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VP}
        style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--sakura)", marginBottom: 8 }}
      >
        // WHO I AM
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ delay: 0.05 }}
        className="section-title"
      >
        About <span className="neon-cyan">Me</span>
      </motion.h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--gap)" }}>
        {/* Bio Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.5 }}
          className="glass-card"
          style={{ gridColumn: "span 2" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 320px) 1fr 1fr", gap: "32px", alignItems: "stretch" }} className="about-inner-grid">
            {/* Photo column */}
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                justifyContent: "center",
                width: "100%",
                minHeight: "100%",
              }}
            >
              <img
                src={profilePhoto}
                alt="SVS Sujal"
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "300px",
                  borderRadius: "18px",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
                  border: "1px solid var(--glass-border)",
                }}
              />
            </div>

            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--sakura)", textTransform: "uppercase", marginBottom: "14px" }}>
                Who I Am
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "16px" }}>
                I'm an aspiring Build Engineer and Cloud platform geek with strong interests in Full Stack Development, DevOps, Artificial Intelligence, and Agile Project Management.
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "16px" }}>
                I specialize in creating scalable applications, automation workflows, and intelligent systems using React, Django, Python, Docker, Jenkins, and Machine Learning frameworks.
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                I enjoy combining technical expertise with leadership, communication, and problem-solving skills to deliver impactful digital experiences.
              </p>
            </div>

            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--sakura)", textTransform: "uppercase", marginBottom: "14px" }}>
                Interests
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {interests.map((i) => (
                  <span key={i} className="tag">{i}</span>
                ))}
              </div>

              <div style={{ marginTop: "32px" }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--sakura)", textTransform: "uppercase", marginBottom: "14px" }}>
                  Quick Facts
                </p>
                {[
                  ["📍", "Bengaluru, India"],
                  ["🎓", "B.E. Computing Science, DSU (2022-2026)"],
                  ["📧", "svss.officia13@gmail.com"],
                  ["📱", "+91 8105115505"],
                  ["⚡", "Available for opportunities"],
                ].map(([icon, text]) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "1rem" }}>{icon}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{"@media(max-width:768px){.about-inner-grid{grid-template-columns:1fr!important;}}"}</style>
    </section>
  );
}
