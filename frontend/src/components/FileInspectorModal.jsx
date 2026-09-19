import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaMinus,
  FaExpand,
  FaDownload,
  FaExternalLinkAlt,
  FaCopy,
  FaCheck,
  FaFilePdf,
  FaCode,
  FaEye,
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useFileInspector, DEFAULT_FILES } from '../context/FileInspectorContext';
import { useStance } from '../context/StanceContext';
import PDFCanvasViewer from './PDFCanvasViewer';

export default function FileInspectorModal() {
  const {
    isOpen,
    windowMode,
    activeFile,
    selectedTabId,
    setSelectedTabId,
    closeFile,
    minimizeFile,
    maximizeFile,
    setWindowMode,
    restoreFile,
    openFile,
  } = useFileInspector();

  const { stance } = useStance();
  const [copied, setCopied] = useState(false);

  // Keyboard shortcut listener (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && windowMode !== 'minimized') {
        closeFile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, windowMode, closeFile]);

  if (!isOpen && windowMode !== 'minimized') return null;

  // Minimized Floating Status Pill
  if (windowMode === 'minimized' && isOpen) {
    return (
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(14, 4, 8, 0.95)',
          border: `1px solid ${stance.primary}`,
          borderRadius: 50,
          padding: '8px 16px',
          backdropFilter: 'blur(20px)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 20px ${stance.glow}`,
          cursor: 'pointer',
          color: '#fff',
        }}
        onClick={restoreFile}
      >
        <span style={{ fontSize: '1.1rem' }}>{activeFile?.icon || '📁'}</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {activeFile?.title}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--sakura)', fontWeight: 600 }}>
            Minimized (Click to Restore)
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            restoreFile();
          }}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: 26,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
          title="Restore Fullscreen"
        >
          <FaExpand style={{ fontSize: '0.7rem' }} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            closeFile();
          }}
          style={{
            background: 'rgba(235,50,70,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: 26,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ff6b7d',
            cursor: 'pointer',
          }}
          title="Close"
        >
          <FaTimes style={{ fontSize: '0.7rem' }} />
        </button>
      </motion.div>
    );
  }

  // Active tab resolution
  const currentTab = activeFile?.tabs?.find(t => t.id === selectedTabId) || activeFile?.tabs?.[0];

  const handleCopyCode = () => {
    if (currentTab?.content) {
      navigator.clipboard.writeText(currentTab.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFullscreen = windowMode === 'fullscreen';
  const isSmall = windowMode === 'small';

  const modalStyle = isFullscreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
        borderRadius: 0,
        margin: 0,
        zIndex: 9999,
      }
    : isSmall
    ? {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(94vw, 680px)',
        height: 'min(82vh, 560px)',
        borderRadius: 16,
        zIndex: 9999,
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(96vw, 1200px)',
        height: 'min(92vh, 860px)',
        borderRadius: 18,
        zIndex: 9999,
      };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: isFullscreen ? 'rgba(0,0,0,0.94)' : 'rgba(0,0,0,0.80)',
          backdropFilter: 'blur(18px)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && !isFullscreen) closeFile();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="file-inspector-window"
          style={{
            ...modalStyle,
            background: 'rgba(12, 4, 8, 0.98)',
            border: isFullscreen ? 'none' : '1px solid var(--glass-border)',
            boxShadow: `0 24px 80px rgba(0,0,0,0.95), 0 0 40px ${stance.glow}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* ── Window Titlebar (Close, Minimize, Maximize / 100% Fullscreen) ── */}
          <div
            className="modal-titlebar"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              background: 'linear-gradient(90deg, rgba(22,6,12,0.98), rgba(35,8,16,0.98))',
              borderBottom: '1px solid var(--glass-border)',
              userSelect: 'none',
              gap: 12,
              flexShrink: 0,
            }}
          >
            {/* Left: Traffic Lights (Close / Minimize / Maximize) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Close Button (Red) */}
              <button
                onClick={closeFile}
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  background: '#ff5f56',
                  border: '1px solid #e0443e',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  fontSize: '0.55rem',
                  color: 'rgba(0,0,0,0.6)',
                  fontWeight: 900,
                }}
                title="Close (Esc)"
              >
                ✕
              </button>

              {/* Minimize Button (Yellow) */}
              <button
                onClick={minimizeFile}
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  background: '#ffbd2e',
                  border: '1px solid #dea123',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  fontSize: '0.55rem',
                  color: 'rgba(0,0,0,0.6)',
                  fontWeight: 900,
                }}
                title="Minimize"
              >
                一
              </button>

              {/* Maximize / 100% Fullscreen Toggle (Green) */}
              <button
                onClick={maximizeFile}
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  background: '#27c93f',
                  border: '1px solid #1aab29',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  fontSize: '0.55rem',
                  color: 'rgba(0,0,0,0.6)',
                  fontWeight: 900,
                }}
                title={isFullscreen ? "Restore Window" : "Consume 100% UI Space (Fullscreen)"}
              >
                {isFullscreen ? '🗗' : '🗖'}
              </button>

              <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

              {/* File Icon & Breadcrumbs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                <span style={{ fontSize: '0.95rem' }}>{activeFile?.icon || '📁'}</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {activeFile?.title}
                    </span>
                    {activeFile?.size && (
                      <span className="badge badge-gold" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                        {activeFile.size}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {activeFile?.path}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Window Size Quick Selectors & Action Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Window Size Switcher: Small | Large | 100% Fullscreen */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.45)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 8,
                  padding: 2,
                  gap: 2,
                }}
                className="window-size-controls"
              >
                <button
                  onClick={() => setWindowMode('small')}
                  style={{
                    background: windowMode === 'small' ? 'rgba(255,183,197,0.2)' : 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    padding: '3px 8px',
                    color: windowMode === 'small' ? 'var(--sakura)' : 'var(--text-muted)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title="Small Window"
                >
                  Small
                </button>
                <button
                  onClick={() => setWindowMode('large')}
                  style={{
                    background: windowMode === 'large' ? 'rgba(255,183,197,0.2)' : 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    padding: '3px 8px',
                    color: windowMode === 'large' ? 'var(--sakura)' : 'var(--text-muted)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title="Large Window"
                >
                  Large
                </button>
                <button
                  onClick={() => setWindowMode('fullscreen')}
                  style={{
                    background: windowMode === 'fullscreen' ? `linear-gradient(135deg, ${stance.secondary}, ${stance.primary})` : 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    padding: '3px 8px',
                    color: windowMode === 'fullscreen' ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                  title="100% Fullscreen Mode"
                >
                  <FaExpand style={{ fontSize: '0.6rem' }} /> 100% Full
                </button>
              </div>

              {/* Action: Open in tab */}
              {activeFile?.url && (
                <a
                  href={activeFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{
                    fontSize: '0.72rem',
                    padding: '4px 10px',
                    borderRadius: 8,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                  title="Open file directly in new browser tab"
                >
                  <FaExternalLinkAlt /> Open Tab ↗
                </a>
              )}

              {/* Action: Download */}
              {activeFile?.downloadUrl && (
                <a
                  href={activeFile.downloadUrl}
                  download={activeFile.downloadName || 'document.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    fontSize: '0.72rem',
                    padding: '4px 12px',
                    borderRadius: 8,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    textDecoration: 'none',
                  }}
                >
                  <FaDownload /> Download
                </a>
              )}

              {activeFile?.github && (
                <a
                  href={activeFile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{
                    fontSize: '0.72rem',
                    padding: '4px 10px',
                    borderRadius: 8,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <FaExternalLinkAlt /> GitHub ↗
                </a>
              )}

              {/* Close Button */}
              <button
                onClick={closeFile}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 8,
                  padding: '4px 8px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                }}
                title="Close"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* ── Subheader / Quick File Switcher Bar ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 14px',
              background: 'rgba(18, 6, 12, 0.85)',
              borderBottom: '1px solid var(--glass-border)',
              overflowX: 'auto',
              gap: 8,
              flexShrink: 0,
            }}
          >
            {/* Quick File Switcher Pill Group */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                EXPLORE:
              </span>
              {Object.values(DEFAULT_FILES).map((f) => {
                const isActive = activeFile?.id === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => openFile(f.id)}
                    style={{
                      background: isActive ? `linear-gradient(135deg, ${stance.secondary}, ${stance.primary})` : 'rgba(255,255,255,0.05)',
                      border: isActive ? `1px solid ${stance.primary}` : '1px solid transparent',
                      borderRadius: 6,
                      padding: '3px 8px',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      fontSize: '0.70rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>{f.icon}</span>
                    <span>{f.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* If Active File has tabs, show tabs switcher */}
            {activeFile?.tabs && activeFile.tabs.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {activeFile.tabs.map((tab) => {
                  const isTabActive = (selectedTabId || activeFile.tabs[0].id) === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTabId(tab.id)}
                      style={{
                        background: isTabActive ? 'rgba(255,183,197,0.18)' : 'transparent',
                        border: isTabActive ? '1px solid var(--sakura)' : '1px solid transparent',
                        borderRadius: 6,
                        padding: '3px 9px',
                        color: isTabActive ? 'var(--sakura)' : 'var(--text-muted)',
                        fontSize: '0.70rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        transition: 'all 0.2s',
                      }}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Main Content Body ── */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex' }}>
            {/* 1. PDF CANVAS RENDERER TAB (Zero iframes, 100% immune to X-Frame-Options) */}
            {currentTab?.language === 'pdf' || (activeFile?.type === 'pdf' && selectedTabId === 'pdf_view') ? (
              <PDFCanvasViewer
                fileUrl={activeFile.url}
                fileName={activeFile.downloadName}
                onSwitchToMarkdown={() => setSelectedTabId('cv_summary')}
              />
            ) : (
              /* 2. CODE / MARKDOWN / CV TEXT INSPECTOR TAB */
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                {/* Tech tags bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {activeFile?.tech && (
                    <>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginRight: 4 }}>
                        STACK:
                      </span>
                      {activeFile.tech.map(t => (
                        <span key={t} className="tag" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                          {t}
                        </span>
                      ))}
                    </>
                  )}
                  {currentTab?.content && (
                    <button
                      onClick={handleCopyCode}
                      style={{
                        marginLeft: 'auto',
                        background: 'rgba(255,183,197,0.12)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 6,
                        padding: '4px 12px',
                        color: copied ? 'var(--green)' : 'var(--sakura)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      {copied ? <FaCheck /> : <FaCopy />}
                      {copied ? 'Copied to Clipboard!' : 'Copy Content'}
                    </button>
                  )}
                </div>

                {/* Tab content viewer */}
                <div style={{ flex: 1, padding: '24px', fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                  {currentTab?.language === 'markdown' ? (
                    <div style={{ maxWidth: '900px', margin: '0 auto' }} className="markdown-prose">
                      <ReactMarkdown>{currentTab.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--text-primary)', background: 'rgba(0,0,0,0.5)', padding: '18px', borderRadius: 12, border: '1px solid var(--glass-border)', fontFamily: 'monospace', fontSize: '0.84rem' }}>
                      <code>{currentTab?.content || 'No file content available.'}</code>
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Footer Statusbar ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 14px',
              background: 'rgba(10, 3, 7, 0.95)',
              borderTop: '1px solid var(--glass-border)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              userSelect: 'none',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>WINDOW: <strong style={{ color: 'var(--sakura)' }}>{windowMode.toUpperCase()}</strong></span>
              <span>100% UI Space: <strong style={{ color: isFullscreen ? 'var(--green)' : 'var(--text-muted)' }}>{isFullscreen ? 'ACTIVE' : 'OFF'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: 4 }}>ESC</kbd> to exit</span>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .file-inspector-window {
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            transform: none !important;
            width: 100vw !important;
            height: 100dvh !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100dvh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            border: none !important;
            margin: 0 !important;
          }
          .window-size-controls {
            display: none !important;
          }
          .modal-titlebar {
            padding: 8px 10px !important;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
