import { useState, useEffect, useRef } from 'react';
import {
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaDownload,
  FaExternalLinkAlt,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight,
  FaRedo,
} from 'react-icons/fa';

export default function PDFCanvasViewer({ fileUrl, fileName, onSwitchToMarkdown }) {
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' (continuous scroll) | 'single'

  // Load PDF.js library dynamically from CDN with caching
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadPdfJs = async () => {
      try {
        let pdfjsLib = window.pdfjsLib;

        if (!pdfjsLib) {
          // Load PDF.js script dynamically
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load PDF engine'));
            document.head.appendChild(script);
          });
          pdfjsLib = window.pdfjsLib;
        }

        if (pdfjsLib) {
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

          // Fetch PDF as ArrayBuffer to bypass any iframe CSP/X-Frame restrictions
          const res = await fetch(fileUrl || '/resume.pdf');
          if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
          const arrayBuffer = await res.arrayBuffer();

          const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          if (isMounted) {
            setPdfDoc(doc);
            setNumPages(doc.numPages);
            setLoading(false);
          }
        }
      } catch (err) {
        console.warn('PDF.js loading failed, falling back to direct controls:', err);
        if (isMounted) {
          setError(err.message || 'Unable to render PDF canvas');
          setLoading(false);
        }
      }
    };

    loadPdfJs();

    return () => {
      isMounted = false;
    };
  }, [fileUrl]);

  // Render pages onto canvases
  useEffect(() => {
    if (!pdfDoc) return;

    const renderAllPages = async () => {
      const container = containerRef.current;
      if (!container) return;

      container.innerHTML = '';

      const pagesToRender =
        viewMode === 'single'
          ? [currentPage]
          : Array.from({ length: numPages }, (_, i) => i + 1);

      for (const pageNum of pagesToRender) {
        try {
          const page = await pdfDoc.getPage(pageNum);
          const pixelRatio = window.devicePixelRatio || 1;
          const viewport = page.getViewport({ scale: scale * 1.3 });

          const wrapper = document.createElement('div');
          wrapper.style.marginBottom = '24px';
          wrapper.style.display = 'flex';
          wrapper.style.flexDirection = 'column';
          wrapper.style.alignItems = 'center';
          wrapper.style.position = 'relative';

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.height = viewport.height * pixelRatio;
          canvas.width = viewport.width * pixelRatio;
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          canvas.style.borderRadius = '8px';
          canvas.style.boxShadow = '0 10px 40px rgba(0,0,0,0.6)';
          canvas.style.background = '#ffffff';

          context.scale(pixelRatio, pixelRatio);

          wrapper.appendChild(canvas);

          // Page number indicator in continuous mode
          if (numPages > 1 && viewMode === 'all') {
            const pageBadge = document.createElement('div');
            pageBadge.innerText = `Page ${pageNum} of ${numPages}`;
            pageBadge.style.fontSize = '0.68rem';
            pageBadge.style.color = 'var(--text-muted)';
            pageBadge.style.marginTop = '6px';
            wrapper.appendChild(pageBadge);
          }

          container.appendChild(wrapper);

          await page.render({ canvasContext: context, viewport }).promise;
        } catch (e) {
          console.error(`Error rendering page ${pageNum}:`, e);
        }
      }
    };

    renderAllPages();
  }, [pdfDoc, scale, currentPage, viewMode, numPages]);

  const zoomIn = () => setScale(s => Math.min(s + 0.2, 2.5));
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.6));
  const resetZoom = () => setScale(1.15);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#16141a' }}>
      {/* ── PDF Toolbar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'rgba(20, 7, 14, 0.96)',
          borderBottom: '1px solid var(--glass-border)',
          flexWrap: 'wrap',
          gap: 10,
          zIndex: 20,
        }}
      >
        {/* Left: View Mode & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.4)', borderRadius: 6, padding: 2 }}>
            <button
              onClick={() => setViewMode('all')}
              style={{
                background: viewMode === 'all' ? 'rgba(255,183,197,0.2)' : 'transparent',
                border: 'none',
                borderRadius: 4,
                padding: '3px 8px',
                color: viewMode === 'all' ? 'var(--sakura)' : 'var(--text-muted)',
                fontSize: '0.70rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Continuous
            </button>
            <button
              onClick={() => setViewMode('single')}
              style={{
                background: viewMode === 'single' ? 'rgba(255,183,197,0.2)' : 'transparent',
                border: 'none',
                borderRadius: 4,
                padding: '3px 8px',
                color: viewMode === 'single' ? 'var(--sakura)' : 'var(--text-muted)',
                fontSize: '0.70rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Single Page
            </button>
          </div>

          {viewMode === 'single' && numPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-primary)' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: 4,
                  padding: '3px 6px',
                  color: '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.4 : 1,
                }}
              >
                <FaChevronLeft />
              </button>
              <span>
                {currentPage} / {numPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, numPages))}
                disabled={currentPage === numPages}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: 4,
                  padding: '3px 6px',
                  color: '#fff',
                  cursor: currentPage === numPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === numPages ? 0.4 : 1,
                }}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>

        {/* Center: Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={zoomOut}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 6,
              padding: '4px 8px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.75rem',
            }}
            title="Zoom Out"
          >
            <FaSearchMinus />
          </button>
          <button
            onClick={resetZoom}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 6,
              padding: '4px 8px',
              color: 'var(--sakura)',
              cursor: 'pointer',
              fontSize: '0.70rem',
              fontWeight: 700,
            }}
            title="Reset Zoom (100%)"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={zoomIn}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 6,
              padding: '4px 8px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.75rem',
            }}
            title="Zoom In"
          >
            <FaSearchPlus />
          </button>
        </div>

        {/* Right: Actions (Open in Tab, Download, Switch to CV) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onSwitchToMarkdown && (
            <button
              onClick={onSwitchToMarkdown}
              className="btn-ghost"
              style={{ fontSize: '0.70rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
              title="View Formatted Markdown CV"
            >
              <FaFileAlt /> View CV Text
            </button>
          )}
          <a
            href={fileUrl || '/resume.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ fontSize: '0.70rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
            title="Open raw PDF file in new browser tab"
          >
            <FaExternalLinkAlt /> Open Tab ↗
          </a>
          <a
            href={fileUrl || '/resume.pdf'}
            download={fileName || 'SVS_Sujal_Resume.pdf'}
            className="btn-primary"
            style={{ fontSize: '0.70rem', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <FaDownload /> Download PDF
          </a>
        </div>
      </div>

      {/* ── Canvas Rendering Area ── */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#121016',
          position: 'relative',
        }}
      >
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(255,183,197,0.2)', borderTopColor: 'var(--sakura)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '0.84rem', color: 'var(--sakura)', fontWeight: 700 }}>
              Rendering High-Precision PDF Document...
            </p>
          </div>
        )}

        {error && (
          <div style={{ maxWidth: 460, margin: '40px auto', textAlign: 'center', padding: '24px', background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.3)', borderRadius: 16 }}>
            <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>📄</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ff6b7d', marginBottom: 8 }}>
              Native Browser PDF Viewer Blocked
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18 }}>
              Your browser security settings prevented embedded PDF rendering. You can view the formatted CV text or open the direct PDF in a new tab.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              {onSwitchToMarkdown && (
                <button onClick={onSwitchToMarkdown} className="btn-primary" style={{ fontSize: '0.78rem' }}>
                  <FaFileAlt /> View Formatted CV
                </button>
              )}
              <a href={fileUrl || '/resume.pdf'} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '0.78rem' }}>
                <FaExternalLinkAlt /> Open in New Tab ↗
              </a>
            </div>
          </div>
        )}

        <div ref={containerRef} style={{ display: loading || error ? 'none' : 'block', width: 'fit-content' }} />
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
