import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import profilePhoto from "../assets/profile.png";

const contactInfo = [
  { icon: "✉", label: "Email", value: "svss.officia13@gmail.com", href: "mailto:svss.officia13@gmail.com" },
  { icon: "📱", label: "Phone", value: "+91 8105115505", href: "tel:+918105115505" },
  { icon: "in", label: "LinkedIn", value: "linkedin.com/in/svss13", href: "https://www.linkedin.com/in/svss13" },
  { icon: "⑂", label: "GitHub", value: "github.com/SVSS13", href: "https://github.com/SVSS13" },
  { icon: "📍", label: "Location", value: "Bengaluru, India" },
];

const VP = { once: true, amount: 0.05 };

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", otp: "" });
  const [step, setStep] = useState(1); // 1: Form, 2: OTP Entry, 3: Success
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const handleChange = (e) => {
    setErrorMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Send OTP to Visitor Email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg("Please enter a valid email address (e.g. name@company.com).");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("contact/send-otp/", {
        name: formData.name,
        email: formData.email,
      });
      if (res.data?.success) {
        setInfoMsg(`A 6-digit verification code was sent to ${formData.email}. Please check your inbox or spam folder.`);
        setStep(2);
      }
    } catch (err) {
      const errText = err.response?.data?.error || "Failed to send verification code. Please check for typos.";
      setErrorMsg(errText);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Deliver Message
  const handleVerifyAndSend = async (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.trim().length < 6) {
      setErrorMsg("Please enter the 6-digit code sent to your email.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const res = await API.post("contact/verify-and-send/", formData);
      if (res.data?.success) {
        setStep(3);
        setFormData({ name: "", email: "", message: "", otp: "" });
      }
    } catch (err) {
      const errText = err.response?.data?.error || "Invalid verification code. Please try again.";
      setErrorMsg(errText);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setErrorMsg("");
    setInfoMsg("");
    try {
      const res = await API.post("contact/send-otp/", {
        name: formData.name,
        email: formData.email,
      });
      if (res.data?.success) {
        setInfoMsg("A fresh 6-digit code has been sent to your email.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section" style={{ width: "100%", maxWidth: "1240px", margin: "0 auto", overflow: "hidden", boxSizing: "border-box" }}>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VP}
        style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--sakura)", marginBottom: 8 }}
      >
        // GET IN TOUCH
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ delay: 0.05 }}
        className="section-title"
        style={{ marginBottom: "24px" }}
      >
        Get in <span className="neon-cyan">Touch</span>
      </motion.h2>

      <div className="contact-grid">
        {/* Left — Info Card with Profile Avatar */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.4 }}
          style={{ width: "100%", boxSizing: "border-box", padding: "clamp(18px, 4vw, 26px)" }}
        >
          {/* Sujal Profile Identity Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
            <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
              <img
                src={profilePhoto}
                alt="SVS Sujal"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  border: "2px solid var(--sakura)",
                  boxShadow: "0 0 16px rgba(255,183,197,0.4)",
                  display: "block",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "var(--green)",
                  border: "2px solid #0c0408",
                  boxShadow: "0 0 8px var(--green)",
                }}
                title="Online / Ready to Connect"
              />
            </div>
            <div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
                S V S Sujal
              </h4>
              <p style={{ fontSize: "0.75rem", color: "var(--sakura)", fontWeight: 600, margin: "2px 0 0" }}>
                Direct Messaging & SMS Gateway
              </p>
            </div>
          </div>

          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--sakura)", textTransform: "uppercase", marginBottom: "8px" }}>
            Direct Channels
          </p>
          <h3 style={{ fontSize: "clamp(1.15rem, 3vw, 1.35rem)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "8px" }}>
            Open to opportunities
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "22px" }}>
            Whether you have an engineering role to discuss, a project proposal, or want to connect — my verified inbox is always open.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
            {contactInfo.map((c) => (
              <div key={c.label} style={{ width: "100%", minWidth: 0 }}>
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      background: "rgba(255,183,197,0.06)",
                      border: "1px solid var(--glass-border)",
                      textDecoration: "none",
                      transition: "all 0.2s",
                      width: "100%",
                      boxSizing: "border-box",
                      minWidth: 0,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--sakura)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--glass-border)"; }}
                  >
                    <span style={{ color: "var(--sakura)", fontSize: "0.95rem", width: "20px", textAlign: "center", flexShrink: 0 }}>{c.icon}</span>
                    <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>{c.label}</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.value}</div>
                    </div>
                  </a>
                ) : (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "10px 12px", borderRadius: "12px",
                    background: "rgba(255,183,197,0.06)", border: "1px solid var(--glass-border)",
                    width: "100%", boxSizing: "border-box", minWidth: 0,
                  }}>
                    <span style={{ color: "var(--sakura)", fontSize: "0.95rem", width: "20px", textAlign: "center", flexShrink: 0 }}>{c.icon}</span>
                    <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>{c.label}</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.value}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Form Card */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.4 }}
          style={{ width: "100%", boxSizing: "border-box", padding: "clamp(18px, 4vw, 26px)" }}
        >
          <AnimatePresence mode="wait">
            {step === 3 ? (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: "14px", padding: "28px 8px" }}
              >
                <span style={{ fontSize: "3rem" }}>🌸</span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--green)", margin: 0 }}>Email Verified & Delivered!</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", maxWidth: "320px", lineHeight: 1.6, margin: 0 }}>
                  Thank you! Your identity has been verified and your message has been delivered directly to Sujal's inbox.
                </p>
                <button className="btn-ghost" onClick={() => setStep(1)} style={{ marginTop: 6 }}>
                  Send Another Message
                </button>
              </motion.div>
            ) : step === 2 ? (
              <motion.form
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleVerifyAndSend}
                style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", boxSizing: "border-box" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--sakura)", textTransform: "uppercase", margin: 0 }}>
                    Step 2: Verify Email
                  </p>
                  <span style={{ fontSize: "0.68rem", color: "#38bdf8", fontWeight: 600 }}>
                    🔐 6-Digit OTP Handshake
                  </span>
                </div>

                {infoMsg && (
                  <div style={{ padding: "10px 12px", borderRadius: "10px", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", color: "#bae6fd", fontSize: "0.78rem", lineHeight: 1.45, wordBreak: "break-word" }}>
                    {infoMsg}
                  </div>
                )}

                {errorMsg && (
                  <div style={{ padding: "10px 12px", borderRadius: "10px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#fca5a5", fontSize: "0.78rem", lineHeight: 1.45, wordBreak: "break-word" }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div style={{ width: "100%" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    name="otp"
                    maxLength={6}
                    required
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="• • • • • •"
                    className="bento-input"
                    style={{
                      fontSize: "clamp(1.2rem, 5vw, 1.5rem)",
                      letterSpacing: "clamp(0.2em, 3vw, 0.35em)",
                      textAlign: "center",
                      fontWeight: 800,
                      color: "var(--cyan)",
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "10px 8px",
                    }}
                    autoFocus
                  />
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px", display: "block", wordBreak: "break-all" }}>
                    Sent to: <strong>{formData.email}</strong>
                  </span>
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.6 : 1, minHeight: "44px" }}>
                  {loading ? "Verifying Code..." : "Verify & Deliver Message →"}
                </button>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px", flexWrap: "wrap", gap: "8px" }}>
                  <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", textDecoration: "underline", padding: "4px 0" }}>
                    ← Edit details
                  </button>
                  <button type="button" onClick={handleResendOtp} disabled={loading} style={{ background: "none", border: "none", color: "var(--sakura)", fontSize: "0.75rem", cursor: "pointer", fontWeight: 700, padding: "4px 0" }}>
                    Resend Code 🔄
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleRequestOtp}
                style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", boxSizing: "border-box" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--sakura)", textTransform: "uppercase", margin: 0 }}>
                    Send a Message
                  </p>
                  <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981" }}></span>
                    Live OTP Protected
                  </span>
                </div>

                {errorMsg && (
                  <div style={{ padding: "10px 12px", borderRadius: "10px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#fca5a5", fontSize: "0.78rem", lineHeight: 1.45, wordBreak: "break-word" }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div style={{ width: "100%" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>Your Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" className="bento-input" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>

                <div style={{ width: "100%" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Email Address <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>(OTP Verified)</span>
                  </label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="bento-input" style={{ width: "100%", boxSizing: "border-box" }} />
                </div>

                <div style={{ width: "100%" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>Message</label>
                  <textarea name="message" required rows={4} value={formData.message} onChange={handleChange} placeholder="Tell me about your project, opportunity, or idea..." className="bento-input" style={{ resize: "vertical", width: "100%", boxSizing: "border-box", minHeight: "90px" }} />
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.6 : 1, minHeight: "44px" }}>
                  {loading ? "Sending Verification Code..." : "Verify Email & Send →"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 22px;
          align-items: start;
          width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
        }
      `}</style>
    </section>
  );
}
