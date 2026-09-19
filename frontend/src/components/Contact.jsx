import { useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

const contactInfo = [
  { icon: "✉", label: "Email", value: "svss.officia13@gmail.com", href: "mailto:svss.officia13@gmail.com" },
  { icon: "📱", label: "Phone", value: "+91 8105115505", href: "tel:+918105115505" },
  { icon: "in", label: "LinkedIn", value: "linkedin.com/in/svss13", href: "https://www.linkedin.com/in/svss13" },
  { icon: "⑂", label: "GitHub", value: "github.com/SVSS13", href: "https://github.com/SVSS13" },
  { icon: "📍", label: "Location", value: "Bengaluru, India" },
];

const VP = { once: true, amount: 0.05 };

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const handleChange = (e) => {
    setErrorMsg("");
    setSuggestion("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applySuggestion = () => {
    if (suggestion) {
      setFormData({ ...formData, email: suggestion });
      setSuggestion("");
      setErrorMsg("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuggestion("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg("Please enter a valid email address format (e.g. name@example.com).");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("contact/", formData);
      if (res.data && res.data.success) {
        setSent(true);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (err) {
      const respData = err.response?.data;
      if (respData?.error) {
        setErrorMsg(respData.error);
        if (respData.suggestion) {
          setSuggestion(respData.suggestion);
        }
      } else {
        setErrorMsg("Failed to deliver message. Please contact Sujal directly at svss.officia13@gmail.com.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VP}
        style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--sakura)", marginBottom: 8 }}
      >
        // GET IN TOUCH
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ delay: 0.05 }}
        className="section-title"
      >
        Get in <span className="neon-cyan">Touch</span>
      </motion.h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "var(--gap)", alignItems: "start" }}>
        {/* Left — Info */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VP}
          transition={{ duration: 0.5 }}
        >
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--sakura)", textTransform: "uppercase", marginBottom: "8px" }}>
            Get In Touch
          </p>
          <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "8px" }}>
            Open to opportunities
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "28px" }}>
            Whether you have a project in mind, a role to discuss, or just want to say hi — my inbox is always open.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {contactInfo.map((c) => (
              <div key={c.label}>
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      background: "rgba(255,183,197,0.06)",
                      border: "1px solid var(--glass-border)",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--sakura)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--glass-border)"; }}
                  >
                    <span style={{ color: "var(--sakura)", fontSize: "0.95rem", width: "20px", textAlign: "center" }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{c.label}</div>
                      <div style={{ fontSize: "0.83rem", color: "var(--text-primary)", fontWeight: 600 }}>{c.value}</div>
                    </div>
                  </a>
                ) : (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "10px 14px", borderRadius: "12px",
                    background: "rgba(255,183,197,0.06)", border: "1px solid var(--glass-border)",
                  }}>
                    <span style={{ color: "var(--sakura)", fontSize: "0.95rem", width: "20px", textAlign: "center" }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{c.label}</div>
                      <div style={{ fontSize: "0.83rem", color: "var(--text-primary)", fontWeight: 600 }}>{c.value}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Form */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VP}
          transition={{ duration: 0.5 }}
        >
          {sent ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: "16px", padding: "40px 0" }}>
              <span style={{ fontSize: "3rem" }}>🌸</span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--green)" }}>Message Verified & Sent!</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", maxWidth: "340px", lineHeight: 1.6 }}>
                Thank you for reaching out. Your message has been verified and delivered to Sujal.
              </p>
              <button className="btn-ghost" onClick={() => setSent(false)}>Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--sakura)", textTransform: "uppercase", margin: 0 }}>
                  Send a Message
                </p>
                <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981" }}></span>
                  Domain MX Verified
                </span>
              </div>

              {errorMsg && (
                <div style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.35)",
                  color: "#fca5a5",
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>⚠️</span>
                    <span>{errorMsg}</span>
                  </div>
                  {suggestion && (
                    <div style={{ fontSize: "0.75rem", color: "var(--sakura)" }}>
                      Did you mean:{" "}
                      <button
                        type="button"
                        onClick={applySuggestion}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          color: "var(--cyan)",
                          textDecoration: "underline",
                          cursor: "pointer",
                          fontWeight: 700
                        }}
                      >
                        {suggestion}
                      </button>
                      ? Click to apply.
                    </div>
                  )}
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Your Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" className="bento-input" />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Email Address <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>(Domain verified)</span>
                </label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="bento-input" />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Message</label>
                <textarea name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="Tell me about your project, opportunity, or idea..." className="bento-input" style={{ resize: "vertical" }} />
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Verifying & Sending..." : "Send Message →"}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #contact .section > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
