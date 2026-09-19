import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaSearchPlus,
  FaSearchMinus,
  FaDownload,
  FaExternalLinkAlt,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight,
  FaArrowsAltH,
} from 'react-icons/fa';

export default function PDFCanvasViewer({ fileUrl, fileName, onSwitchToMarkdown }) {
  const containerRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [fitMode, setFitMode] = useState('fit-width'); // 'fit-width' | 'custom'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' (continuous scroll) | 'single'
  const [pageWidth, setPageWidth] = useState(595);

  // Load PDF.js library dynamically from CDN with caching
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadPdfJs = async () => {
      try {
        let pdfjsLib = window.pdfjsLib;

        if (!pdfjsLib) {
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

          const res = await fetch(fileUrl || '/resume.pdf');
          if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
          const arrayBuffer = await res.arrayBuffer();

          const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          if (isMounted) {
            setPdfDoc(doc);
            setNumPages(doc.numPages);

            // Get unscaled dimensions from page 1
            const firstPage = await doc.getPage(1);
            const unscaled = firstPage.getViewport({ scale: 1.0 });
            setPageWidth(unscaled.width);

            // Compute initial fit-width scale based on current container / screen width
            const parentWidth = scrollWrapperRef.current?.clientWidth || window.innerWidth;
            const isMobile = parentWidth < 600;
            const padding = isMobile ? 12 : 36;
            const targetWidth = Math.max(280, parentWidth - padding);
            const calculatedScale = targetWidth / unscaled.width;

            setScale(calculatedScale);
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

  // Recalculate auto-fit scale on resize if in fit-width mode
  const recalculateFitWidth = useCallback(() => {
    if (!pageWidth) return;
    const parentWidth = scrollWrapperRef.current?.clientWidth || window.innerWidth;
    const isMobile = parentWidth < 600;
    const padding = isMobile ? 12 : 36;
    const targetWidth = Math.max(280, parentWidth - padding);
    const newScale = targetWidth / pageWidth;
    setScale(newScale);
    setFitMode('fit-width');
  }, [pageWidth]);

  useEffect(() => {
    const handleResize = () => {
      if (fitMode === 'fit-width') {
        recalculateFitWidth();
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [fitMode, recalculateFitWidth]);

  // Render pages onto canvases with Retina/HiDPI support
  useEffect(() => {
    if (!pdfDoc) return;

    let cancelRender = false;

    const renderAllPages = async () => {
      const container = containerRef.current;
      if (!container) return;

      container.innerHTML = '';

      const pagesToRender =
        viewMode === 'single'
          ? [currentPage]
          : Array.from({ length: numPages }, (_, i) => i + 1);

      for (const pageNum of pagesToRender) {
        if (cancelRender) break;
        try {
          const page = await pdfDoc.getPage(pageNum);
          const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.5);
          const viewport = page.getViewport({ scale });

          const wrapper = document.createElement('div');
          wrapper.className = 'pdf-page-wrapper';
          wrapper.style.marginBottom = '20px';
          wrapper.style.display = 'flex';
          wrapper.style.flexDirection = 'column';
          wrapper.style.alignItems = 'center';
          wrapper.style.width = '100%';
          wrapper.style.maxWidth = `${viewport.width}px`;
          wrapper.style.position = 'relative';

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.height = Math.floor(viewport.height * pixelRatio);
          canvas.width = Math.floor(viewport.width * pixelRatio);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          canvas.style.maxWidth = '100%';
          canvas.style.height = 'auto';
          canvas.style.borderRadius = '8px';
          canvas.style.boxShadow = '0 8px 32px rgba(0,0,0,0.7)';
          canvas.style.background = '#ffffff';
          canvas.style.display = 'block';

          context.scale(pixelRatio, pixelRatio);

          wrapper.appendChild(canvas);

          if (numPages > 1 && viewMode === 'all') {
            const pageBadge = document.createElement('div');
            pageBadge.innerText = `Page ${pageNum} of ${numPages}`;
            pageBadge.style.fontSize = '0.68rem';
            pageBadge.style.color = 'var(--text-muted)';
            pageBadge.style.marginTop = '6px';
            pageBadge.style.fontWeight = '600';
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

    return () => {
      cancelRender = true;
    };
  }, [pdfDoc, scale, currentPage, viewMode, numPages]);

  const zoomIn = () => {
    setFitMode('custom');
    setScale(s => Math.min(s * 1.2, 3.0));
  };

  const zoomOut = () => {
    setFitMode('custom');
    setScale(s => Math.max(s / 1.2, 0.35));
  };

  const handleFitWidth = () => {
    recalculateFitWidth();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#141218', boxSizing: 'border-box', overflow: 'hidden' }}>
      {/* ── Responsive Toolbar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          background: 'rgba(20, 7, 14, 0.98)',
          borderBottom: '1px solid var(--glass-border)',
          flexWrap: 'wrap',
          gap: 6,
          zIndex: 20,
          flexShrink: 0,
        }}
      >
        {/* Left: View Mode & 100% Fit Width Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={handleFitWidth}
            className="btn-ghost"
            style={{
              fontSize: '0.70rem',
              padding: '4px 8px',
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: fitMode === 'fit-width' ? 'rgba(255,183,197,0.18)' : 'transparent',
              borderColor: fitMode === 'fit-width' ? 'var(--sakura)' : 'var(--glass-border)',
              color: fitMode === 'fit-width' ? 'var(--sakura)' : 'var(--text-secondary)',
              fontWeight: 700,
            }}
            title="Fit 100% Screen Width"
          >
            <FaArrowsAltH /> 100% Width
          </button>

          <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.4)', borderRadius: 6, padding: 2 }}>
            <button
              onClick={() => setViewMode('all')}
              style={{
                background: viewMode === 'all' ? 'rgba(255,183,197,0.2)' : 'transparent',
                border: 'none',
                borderRadius: 4,
                padding: '3px 6px',
                color: viewMode === 'all' ? 'var(--sakura)' : 'var(--text-muted)',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Scroll
            </button>
            <button
              onClick={() => setViewMode('single')}
              style={{
                background: viewMode === 'single' ? 'rgba(255,183,197,0.2)' : 'transparent',
                border: 'none',
                borderRadius: 4,
                padding: '3px 6px',
                color: viewMode === 'single' ? 'var(--sakura)' : 'var(--text-muted)',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Single
            </button>
          </div>

          {viewMode === 'single' && numPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.70rem', color: 'var(--text-primary)' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: 4,
                  padding: '2px 5px',
                  color: '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.4 : 1,
                }}
              >
                <FaChevronLeft style={{ fontSize: '0.6rem' }} />
              </button>
              <span>
                {currentPage}/{numPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, numPages))}
                disabled={currentPage === numPages}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: 4,
                  padding: '2px 5px',
                  color: '#fff',
                  cursor: currentPage === numPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === numPages ? 0.4 : 1,
                }}
              >
                <FaChevronRight style={{ fontSize: '0.6rem' }} />
              </button>
            </div>
          )}
        </div>

        {/* Center: Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={zoomOut}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 6,
              padding: '4px 6px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.70rem',
            }}
            title="Zoom Out"
          >
            <FaSearchMinus />
          </button>
          <span
            style={{
              color: 'var(--sakura)',
              fontSize: '0.68rem',
              fontWeight: 700,
              minWidth: '38px',
              textAlign: 'center',
            }}
          >
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 6,
              padding: '4px 6px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.70rem',
            }}
            title="Zoom In"
          >
            <FaSearchPlus />
          </button>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {onSwitchToMarkdown && (
            <button
              onClick={onSwitchToMarkdown}
              className="btn-ghost"
              style={{ fontSize: '0.68rem', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}
              title="View Text CV"
            >
              <FaFileAlt /> CV Text
            </button>
          )}
          <a
            href={fileUrl || '/cv.pdf'}
            download={fileName || 'SVS_Sujal_CV.pdf'}
            className="btn-primary"
            style={{ fontSize: '0.68rem', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
          >
            <FaDownload /> PDF
          </a>
        </div>
      </div>

      {/* ── Canvas Rendering Viewport (Scrollable with 100% Mobile Sizing) ── */}
      <div
        ref={scrollWrapperRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'auto',
          padding: '12px 6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#0d0b10',
          position: 'relative',
          WebkitOverflowScrolling: 'touch',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
            <div style={{ width: 32, height: 32, border: '3px solid rgba(255,183,197,0.2)', borderTopColor: 'var(--sakura)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '0.80rem', color: 'var(--sakura)', fontWeight: 700 }}>
              Rendering High-Precision PDF Document...
            </p>
          </div>
        )}

        {error && (
          <div style={{ maxWidth: 460, margin: '24px auto', textAlign: 'center', padding: '20px', background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.3)', borderRadius: 16 }}>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>📄</div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ff6b7d', marginBottom: 6 }}>
              Native Browser PDF Viewer Blocked
            </h3>
            <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
              Your browser security settings prevented embedded PDF rendering. You can view the formatted CV text or download the direct PDF.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              {onSwitchToMarkdown && (
                <button onClick={onSwitchToMarkdown} className="btn-primary" style={{ fontSize: '0.75rem' }}>
                  <FaFileAlt /> View Formatted CV
                </button>
              )}
              <a href={fileUrl || '/resume.pdf'} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '0.75rem' }}>
                <FaExternalLinkAlt /> Open in Tab ↗
              </a>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          style={{
            display: loading || error ? 'none' : 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .pdf-page-wrapper canvas {
          max-width: 100% !important;
          height: auto !important;
        }
      `}</style>
    </div>
  );
}

