import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
            Whether you have a project in mind, an engineering role to discuss, or just want to connect — my verified inbox is always open.
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
          <AnimatePresence mode="wait">
            {step === 3 ? (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: "16px", padding: "40px 0" }}
              >
                <span style={{ fontSize: "3.5rem" }}>🌸</span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--green)" }}>Email Verified & Delivered!</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", maxWidth: "340px", lineHeight: 1.6 }}>
                  Thank you! Your identity has been verified and your message has been delivered directly to Sujal's inbox.
                </p>
                <button className="btn-ghost" onClick={() => setStep(1)} style={{ marginTop: 8 }}>
                  Send Another Message
                </button>
              </motion.div>
            ) : step === 2 ? (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyAndSend}
                style={{ display: "flex", flexDirection: "column", gap: "16px" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--sakura)", textTransform: "uppercase", margin: 0 }}>
                    Step 2: Verify Your Email
                  </p>
                  <span style={{ fontSize: "0.68rem", color: "#38bdf8", fontWeight: 600 }}>
                    🔐 6-Digit OTP Handshake
                  </span>
                </div>

                {infoMsg && (
                  <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", color: "#bae6fd", fontSize: "0.8rem", lineHeight: 1.5 }}>
                    {infoMsg}
                  </div>
                )}

                {errorMsg && (
                  <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#fca5a5", fontSize: "0.8rem", lineHeight: 1.5 }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div>
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
                    style={{ fontSize: "1.4rem", letterSpacing: "0.3em", textAlign: "center", fontWeight: 800, color: "var(--cyan)" }}
                    autoFocus
                  />
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                    Sent to: <strong>{formData.email}</strong>
                  </span>
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.6 : 1 }}>
                  {loading ? "Verifying Code..." : "Verify & Deliver Message →"}
                </button>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <button type="button" onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", textDecoration: "underline" }}>
                    ← Edit email or message
                  </button>
                  <button type="button" onClick={handleResendOtp} disabled={loading} style={{ background: "none", border: "none", color: "var(--sakura)", fontSize: "0.75rem", cursor: "pointer", fontWeight: 700 }}>
                    Resend Code 🔄
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRequestOtp}
                style={{ display: "flex", flexDirection: "column", gap: "16px" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--sakura)", textTransform: "uppercase", margin: 0 }}>
                    Send a Message
                  </p>
                  <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981" }}></span>
                    Live OTP Protected
                  </span>
                </div>

                {errorMsg && (
                  <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#fca5a5", fontSize: "0.8rem", lineHeight: 1.5 }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Your Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" className="bento-input" />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                    Email Address <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>(OTP Verified)</span>
                  </label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="bento-input" />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Message</label>
                  <textarea name="message" required rows={4} value={formData.message} onChange={handleChange} placeholder="Tell me about your project, opportunity, or idea..." className="bento-input" style={{ resize: "vertical" }} />
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.6 : 1 }}>
                  {loading ? "Sending Verification Code..." : "Verify Email & Send →"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
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
