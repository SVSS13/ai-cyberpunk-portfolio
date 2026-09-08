import { useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

const contactInfo = [
  { icon: "✉", label: "Email",    value: "svss.officia13@gmail.com", href: "mailto:svss.officia13@gmail.com" },
  { icon: "📱", label: "Phone",    value: "+91 8105115505",           href: "tel:+918105115505" },
  { icon: "⑂",  label: "GitHub",   value: "github.com/SVSS13",        href: "https://github.com/SVSS13" },
  { icon: "in", label: "LinkedIn", value: "linkedin.com/in/svss13",   href: "https://www.linkedin.com/in/svss13" },
  { icon: "📍", label: "Location", value: "Bengaluru, India",         href: null },
];

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("contact/", formData);
      if (res.data.success) {
        setSent(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message");
      }
    } catch (err) {
      const msg = err?.response?.data?.error || "Something went wrong";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <h2 className="section-title">Let's Work Together</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "var(--gap)" }}>

        {/* Left — Contact Info */}
        <motion.div
          className="bento-card"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
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
                      background: "var(--tag-bg)",
                      border: "1px solid var(--tag-border)",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--tag-border)"; }}
                  >
                    <span style={{ color: "var(--accent)", fontSize: "0.95rem", width: "20px", textAlign: "center" }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{c.label}</div>
                      <div style={{ fontSize: "0.83rem", color: "var(--text-primary)", fontWeight: 500 }}>{c.value}</div>
                    </div>
                  </a>
                ) : (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "10px 14px", borderRadius: "12px",
                    background: "var(--tag-bg)", border: "1px solid var(--tag-border)",
                  }}>
                    <span style={{ color: "var(--accent)", fontSize: "0.95rem", width: "20px", textAlign: "center" }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{c.label}</div>
                      <div style={{ fontSize: "0.83rem", color: "var(--text-primary)", fontWeight: 500 }}>{c.value}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Form */}
        <motion.div
          className="bento-card"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {sent ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: "16px" }}>
              <span style={{ fontSize: "3rem" }}>✅</span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>Message Sent!</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Thank you for reaching out. I'll get back to you soon.</p>
              <button className="btn-outline" onClick={() => setSent(false)}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                Send a Message
              </p>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Your Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" className="bento-input" />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="bento-input" />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Message</label>
                <textarea name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="Tell me about your project or idea..." className="bento-input" style={{ resize: "vertical" }} />
              </div>

              <button type="submit" className="btn-accent" disabled={loading} style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Sending..." : "Send Message →"}
              </button>
            </form>
          )}
        </motion.div>

      </div>

      {/* Mobile stack */}
      <style>{`
        @media (max-width: 768px) {
          #contact .section > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export default Contact;
