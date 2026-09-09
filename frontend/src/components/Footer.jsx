import React from "react";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--glass-border)",
      padding: "28px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "16px",
      maxWidth: "1100px",
      margin: "0 auto",
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
        SVS<span style={{ color: "var(--sakura)" }}>.</span>
      </div>

      <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 500 }}>
        © 2026 S V S Sujal. All rights reserved.
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        {[
          { label: "GH", href: "https://github.com/SVSS13" },
          { label: "LI", href: "https://www.linkedin.com/in/svss13" },
          { label: "✉", href: "mailto:svss.officia13@gmail.com" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(255,183,197,0.08)",
              border: "1px solid var(--glass-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--sakura)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--sakura)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(255,183,197,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            {s.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
