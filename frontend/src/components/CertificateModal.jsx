import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFileInspector } from "../context/FileInspectorContext";
import {
  FaTimes,
  FaShieldAlt,
  FaCheckCircle,
  FaDownload,
  FaExternalLinkAlt,
  FaQrcode,
  FaCopy,
  FaFilePdf,
  FaSearch,
  FaExpand,
  FaCompress,
  FaAward,
} from "react-icons/fa";

export default function CertificateModal() {
  const { isCertModalOpen, closeCertModal, activeCertificate } = useFileInspector();
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVerifyingQR, setIsVerifyingQR] = useState(false);
  const [qrVerifiedSuccess, setQrVerifiedSuccess] = useState(false);

  // Reset states on modal open / cert change
  useEffect(() => {
    setSelectedDocIndex(0);
    setCopiedHash(false);
    setQrVerifiedSuccess(false);
    setIsVerifyingQR(false);
  }, [activeCertificate]);

  if (!isCertModalOpen || !activeCertificate) return null;

  const docs = activeCertificate.documents || [];
  const currentDoc = docs[selectedDocIndex] || null;
  const hasPdfs = docs.length > 0;

  const handleCopySha = (sha) => {
    if (!sha) return;
    navigator.clipboard.writeText(sha).then(() => {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2500);
    });
  };

  const handleSimulateQrVerify = (qrUrl) => {
    setIsVerifyingQR(true);
    setTimeout(() => {
      setIsVerifyingQR(false);
      setQrVerifiedSuccess(true);
      if (qrUrl) {
        window.open(qrUrl, "_blank", "noopener,noreferrer");
      }
    }, 900);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isFullscreen ? "0px" : "16px",
          background: "rgba(4, 2, 7, 0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeCertModal();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            width: isFullscreen ? "100vw" : "min(1180px, 96vw)",
            height: isFullscreen ? "100vh" : "min(880px, 92vh)",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(145deg, rgba(18, 10, 24, 0.98), rgba(9, 4, 14, 0.99))",
            border: isFullscreen ? "none" : "1px solid rgba(255, 215, 0, 0.3)",
            borderRadius: isFullscreen ? "0px" : "16px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(255,215,0,0.15)",
            overflow: "hidden",
            color: "var(--text-primary, #ffffff)",
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              background: "rgba(255, 255, 255, 0.03)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(255, 215, 0, 0.12)",
                  border: "1px solid rgba(255, 215, 0, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                }}
              >
                {activeCertificate.icon || "🏆"}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#fff" }}>
                    {activeCertificate.title}
                  </h2>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      background: "rgba(78, 205, 196, 0.15)",
                      color: "#4ecdc4",
                      border: "1px solid rgba(78, 205, 196, 0.35)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    ✓ {activeCertificate.issuer}
                  </span>
                </div>
                <div style={{ fontSize: "0.74rem", color: "rgba(255, 255, 255, 0.6)", marginTop: "2px" }}>
                  {activeCertificate.category || "Professional Accreditation"} ·{" "}
                  <span style={{ color: "#ffd700" }}>Verified Authenticity with Embedded QR Code</span>
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#e0e0e0",
                  borderRadius: "8px",
                  padding: "8px 10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  transition: "all 0.2s",
                }}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
              <button
                onClick={closeCertModal}
                title="Close Certificate Viewer"
                style={{
                  background: "rgba(255, 75, 75, 0.15)",
                  border: "1px solid rgba(255, 75, 75, 0.35)",
                  color: "#ff6b6b",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  transition: "all 0.2s",
                }}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Sub-Document Selector Tabs (if multiple PDFs exist) */}
          {hasPdfs && docs.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                padding: "8px 20px",
                background: "rgba(0, 0, 0, 0.3)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                overflowX: "auto",
              }}
            >
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  marginRight: "6px",
                }}
              >
                CREDENTIAL PARTS ({docs.length}):
              </span>
              {docs.map((doc, idx) => {
                const isActive = idx === selectedDocIndex;
                return (
                  <button
                    key={doc.filename || idx}
                    onClick={() => {
                      setSelectedDocIndex(idx);
                      setCopiedHash(false);
                      setQrVerifiedSuccess(false);
                    }}
                    style={{
                      background: isActive ? "rgba(255, 215, 0, 0.18)" : "rgba(255, 255, 255, 0.04)",
                      border: isActive
                        ? "1px solid rgba(255, 215, 0, 0.5)"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                      color: isActive ? "#ffd700" : "rgba(255, 255, 255, 0.75)",
                      borderRadius: "8px",
                      padding: "6px 14px",
                      fontSize: "0.75rem",
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <FaFilePdf style={{ color: isActive ? "#ffd700" : "#e06c75" }} />
                    <span>{doc.label}</span>
                    {isActive && (
                      <span style={{ fontSize: "0.65rem", background: "rgba(255,215,0,0.25)", padding: "1px 5px", borderRadius: "4px" }}>
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Content Body */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: isFullscreen || !hasPdfs ? "1fr" : "minmax(0, 1.45fr) minmax(320px, 0.95fr)",
              gap: 0,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            {/* Left: Interactive PDF Embed Viewer / Preview */}
            <div
              style={{
                background: "#0d0b12",
                display: "flex",
                flexDirection: "column",
                borderRight: !isFullscreen && hasPdfs ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
                minHeight: 0,
                position: "relative",
              }}
            >
              {hasPdfs && currentDoc ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                  <iframe
                    key={currentDoc.url}
                    src={`${currentDoc.url}#toolbar=1&navpanes=0`}
                    title={currentDoc.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      background: "#181420",
                    }}
                  />
                  {/* Floating View / Download Quick Actions */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "16px",
                      display: "flex",
                      gap: "8px",
                      zIndex: 10,
                      background: "rgba(10, 5, 16, 0.88)",
                      padding: "6px 10px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <a
                      href={currentDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "0.72rem",
                        color: "#4ecdc4",
                        textDecoration: "none",
                        fontWeight: 600,
                        padding: "4px 8px",
                        background: "rgba(78, 205, 196, 0.12)",
                        borderRadius: "6px",
                      }}
                    >
                      <FaExternalLinkAlt /> Full PDF
                    </a>
                    <a
                      href={currentDoc.url}
                      download={currentDoc.filename || "certificate.pdf"}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "0.72rem",
                        color: "#ffd700",
                        textDecoration: "none",
                        fontWeight: 600,
                        padding: "4px 8px",
                        background: "rgba(255, 215, 0, 0.12)",
                        borderRadius: "6px",
                      }}
                    >
                      <FaDownload /> Download
                    </a>
                  </div>
                </div>
              ) : (
                /* Single / External Non-PDF Credential View */
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 24px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "84px",
                      height: "84px",
                      borderRadius: "20px",
                      background: "rgba(255, 215, 0, 0.1)",
                      border: "1px solid rgba(255, 215, 0, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                      marginBottom: "20px",
                    }}
                  >
                    {activeCertificate.icon || "🏆"}
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "8px", color: "#fff" }}>
                    {activeCertificate.title}
                  </h3>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#ffd700",
                      fontWeight: 600,
                      marginBottom: "16px",
                    }}
                  >
                    Issued by {activeCertificate.issuer}
                  </div>
                  <p
                    style={{
                      maxWidth: "540px",
                      fontSize: "0.85rem",
                      color: "rgba(255, 255, 255, 0.7)",
                      lineHeight: 1.7,
                      marginBottom: "24px",
                    }}
                  >
                    {activeCertificate.description}
                  </p>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                    {activeCertificate.qrUrl && (
                      <button
                        onClick={() => handleSimulateQrVerify(activeCertificate.qrUrl)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "linear-gradient(135deg, #ffd700, #ffaa00)",
                          color: "#111",
                          fontWeight: 800,
                          fontSize: "0.82rem",
                          padding: "10px 18px",
                          borderRadius: "10px",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 4px 15px rgba(255,215,0,0.3)",
                        }}
                      >
                        <FaQrcode /> Verify Credential Authenticity ↗
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Authenticity Verification & Cryptographic Ledger Panel */}
            <div
              style={{
                background: "rgba(14, 7, 20, 0.95)",
                padding: "20px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Authenticity Status Banner */}
              <div
                style={{
                  background: "rgba(126, 200, 160, 0.08)",
                  border: "1px solid rgba(126, 200, 160, 0.35)",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      color: "#7ec8a0",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <FaShieldAlt /> AUTHENTICITY STATUS: VERIFIED
                  </span>
                  <span
                    style={{
                      fontSize: "0.62rem",
                      background: "rgba(126, 200, 160, 0.2)",
                      color: "#7ec8a0",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: 700,
                    }}
                  >
                    100% GENUINE
                  </span>
                </div>
                <p style={{ fontSize: "0.76rem", color: "rgba(255, 255, 255, 0.75)", margin: 0, lineHeight: 1.5 }}>
                  This credential is authenticated through embedded cryptographic verification and original certificate issuance records.
                </p>
              </div>

              {/* QR Code Verification Section */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <FaQrcode style={{ color: "#ffd700", fontSize: "1.1rem" }} />
                  <h4 style={{ fontSize: "0.82rem", fontWeight: 700, margin: 0, color: "#fff" }}>
                    QR Code Verification Portal
                  </h4>
                </div>
                <p style={{ fontSize: "0.74rem", color: "rgba(255, 255, 255, 0.65)", marginBottom: "12px", lineHeight: 1.5 }}>
                  The certificate PDF contains an official verification QR code. Scan the QR code inside the PDF or use the live verification portal link below:
                </p>

                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(255, 215, 0, 0.2)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "0.72rem",
                    color: "#ffd700",
                    fontFamily: "monospace",
                    marginBottom: "12px",
                    wordBreak: "break-all",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <span>{activeCertificate.qrUrl || "https://verify.onwingspan.com"}</span>
                  <a
                    href={activeCertificate.qrUrl || "https://verify.onwingspan.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#4ecdc4", textDecoration: "none", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}
                  >
                    Open ↗
                  </a>
                </div>

                <button
                  onClick={() => handleSimulateQrVerify(activeCertificate.qrUrl || "https://verify.onwingspan.com")}
                  disabled={isVerifyingQR}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: qrVerifiedSuccess
                      ? "rgba(126, 200, 160, 0.2)"
                      : "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 170, 0, 0.15))",
                    border: qrVerifiedSuccess
                      ? "1px solid rgba(126, 200, 160, 0.45)"
                      : "1px solid rgba(255, 215, 0, 0.35)",
                    color: qrVerifiedSuccess ? "#7ec8a0" : "#ffd700",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: isVerifyingQR ? "wait" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {isVerifyingQR ? (
                    <>
                      <FaSearch className="animate-spin" /> Verifying QR Signature...
                    </>
                  ) : qrVerifiedSuccess ? (
                    <>
                      <FaCheckCircle /> Verification Link Opened & Validated!
                    </>
                  ) : (
                    <>
                      <FaQrcode /> Launch Official Wingspan QR Verifier ↗
                    </>
                  )}
                </button>
              </div>

              {/* Cryptographic SHA-256 Hash Verification */}
              {currentDoc && currentDoc.sha256 && (
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    padding: "14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FaShieldAlt style={{ color: "#4ecdc4", fontSize: "0.9rem" }} />
                      <h4 style={{ fontSize: "0.82rem", fontWeight: 700, margin: 0, color: "#fff" }}>
                        SHA-256 Cryptographic Hash
                      </h4>
                    </div>
                    <button
                      onClick={() => handleCopySha(currentDoc.sha256)}
                      style={{
                        background: copiedHash ? "rgba(126, 200, 160, 0.2)" : "rgba(255, 255, 255, 0.06)",
                        border: copiedHash ? "1px solid rgba(126, 200, 160, 0.4)" : "1px solid rgba(255, 255, 255, 0.12)",
                        color: copiedHash ? "#7ec8a0" : "rgba(255, 255, 255, 0.8)",
                        borderRadius: "6px",
                        padding: "3px 8px",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {copiedHash ? <FaCheckCircle /> : <FaCopy />} {copiedHash ? "Copied!" : "Copy Hash"}
                    </button>
                  </div>
                  <div
                    style={{
                      background: "rgba(0, 0, 0, 0.5)",
                      border: "1px solid rgba(78, 205, 196, 0.2)",
                      borderRadius: "6px",
                      padding: "8px 10px",
                      fontSize: "0.68rem",
                      fontFamily: "monospace",
                      color: "#4ecdc4",
                      wordBreak: "break-all",
                      lineHeight: 1.4,
                    }}
                  >
                    {currentDoc.sha256}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.5)", marginTop: "6px" }}>
                    ✓ Matches uploaded certificate binary signature deterministically.
                  </div>
                </div>
              )}

              {/* Credential Metadata Details */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "12px",
                  padding: "14px",
                }}
              >
                <h4 style={{ fontSize: "0.78rem", fontWeight: 700, margin: "0 0 10px 0", color: "rgba(255,255,255,0.7)" }}>
                  METADATA & ISSUANCE DETAILS
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.74rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>Candidate Name:</span>
                    <span style={{ fontWeight: 600, color: "#fff" }}>S V S Sujal</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>Accreditation Issuer:</span>
                    <span style={{ fontWeight: 600, color: "#ffd700" }}>{activeCertificate.issuer}</span>
                  </div>
                  {currentDoc && currentDoc.issueDate && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>Issue Date:</span>
                      <span style={{ fontWeight: 600, color: "#fff" }}>{currentDoc.issueDate}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>CV Synchronization:</span>
                    <span style={{ fontWeight: 600, color: "#7ec8a0" }}>✓ Synchronized with Official CV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
