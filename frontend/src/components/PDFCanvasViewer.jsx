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
  FaLayerGroup,
} from 'react-icons/fa';

export default function PDFCanvasViewer({ fileUrl, fileName, onSwitchToMarkdown }) {
  const containerRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [fitMode, setFitMode] = useState('fit-width'); // 'fit-width' | 'custom'
  const [loading, setLoading] = useState(true);
  const [useNativeEmbed, setUseNativeEmbed] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' (continuous scroll) | 'single'
  const [pageWidth, setPageWidth] = useState(595);

  const resolvedUrl = fileUrl || '/cv.pdf';

  // Load PDF.js library dynamically with cross-origin safety
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadPdfJs = async () => {
      try {
        let pdfjsLib = window.pdfjsLib;

        if (!pdfjsLib) {
          await new Promise((resolve, reject) => {
            const existing = document.querySelector('script[src*="pdf.min.js"]');
            if (existing) {
              if (window.pdfjsLib) return resolve();
              existing.addEventListener('load', resolve);
              existing.addEventListener('error', reject);
              return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('CDN PDF.js not reachable'));
            document.head.appendChild(script);
          });
          pdfjsLib = window.pdfjsLib;
        }

        if (pdfjsLib) {
          // Prevent Cross-Origin SecurityError: Use Blob worker or disable worker
          try {
            const workerBlob = new Blob(
              [`importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');`],
              { type: 'application/javascript' }
            );
            pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob);
          } catch {
            pdfjsLib.GlobalWorkerOptions.workerSrc = '';
          }

          let arrayBuffer = null;
          const candidates = [resolvedUrl, '/cv.pdf', '/resume.pdf'];
          for (const urlCandidate of candidates) {
            try {
              const res = await fetch(urlCandidate);
              if (res.ok) {
                arrayBuffer = await res.arrayBuffer();
                break;
              }
            } catch {
              // try next candidate
            }
          }

          if (!arrayBuffer) {
            throw new Error('Unable to fetch PDF binary directly');
          }

          const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
            cMapPacked: true,
            disableAutoFetch: true,
            disableStream: true,
          });

          const doc = await loadingTask.promise;
          if (isMounted) {
            setPdfDoc(doc);
            setNumPages(doc.numPages);

            const firstPage = await doc.getPage(1);
            const unscaled = firstPage.getViewport({ scale: 1.0 });
            setPageWidth(unscaled.width);

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
        console.warn('PDF.js canvas init failed, seamlessly engaging Native PDF Viewer mode:', err);
        if (isMounted) {
          setUseNativeEmbed(true);
          setLoading(false);
        }
      }
    };

    loadPdfJs();

    return () => {
      isMounted = false;
    };
  }, [resolvedUrl]);

  // Recalculate auto-fit scale on resize
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
    if (!pdfDoc || useNativeEmbed) return;

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
          console.warn(`Canvas render note for page ${pageNum}:`, e);
        }
      }
    };

    renderAllPages();

    return () => {
      cancelRender = true;
    };
  }, [pdfDoc, scale, currentPage, viewMode, numPages, useNativeEmbed]);

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
          padding: '8px 14px',
          background: 'rgba(20, 7, 14, 0.98)',
          borderBottom: '1px solid var(--glass-border)',
          flexWrap: 'wrap',
          gap: 8,
          zIndex: 20,
          flexShrink: 0,
        }}
      >
        {/* Left: View Mode & Engine Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {!useNativeEmbed && (
            <>
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
            </>
          )}

          {/* Viewer Mode Toggle */}
          <button
            onClick={() => setUseNativeEmbed(prev => !prev)}
            className="btn-ghost"
            style={{
              fontSize: '0.68rem',
              padding: '4px 8px',
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: useNativeEmbed ? 'var(--gold)' : 'var(--text-muted)',
            }}
            title={useNativeEmbed ? 'Switch to Canvas Rendering' : 'Switch to Direct Embedded Frame'}
          >
            <FaLayerGroup /> {useNativeEmbed ? 'Canvas Mode' : 'Native Viewer'}
          </button>
        </div>

        {/* Center: Zoom Controls (Only in Canvas Mode) */}
        {!useNativeEmbed && (
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
        )}

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
            href={resolvedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ fontSize: '0.68rem', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
            title="Open in Full Browser Tab"
          >
            <FaExternalLinkAlt /> Open Tab ↗
          </a>
          <a
            href={resolvedUrl}
            download={fileName || 'SVS_Sujal_CV.pdf'}
            className="btn-primary"
            style={{ fontSize: '0.68rem', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
          >
            <FaDownload /> PDF
          </a>
        </div>
      </div>

      {/* ── Viewport ── */}
      <div
        ref={scrollWrapperRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'auto',
          padding: useNativeEmbed ? 0 : '14px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#0d0b10',
          position: 'relative',
          WebkitOverflowScrolling: 'touch',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        {loading && !useNativeEmbed && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
            <div style={{ width: 32, height: 32, border: '3px solid rgba(255,183,197,0.2)', borderTopColor: 'var(--sakura)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '0.80rem', color: 'var(--sakura)', fontWeight: 700 }}>
              Rendering High-Precision PDF Document...
            </p>
          </div>
        )}

        {useNativeEmbed ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', flex: 1, background: '#121016' }}>
            <iframe
              src={`${resolvedUrl}#toolbar=1&navpanes=0&view=FitH`}
              title={fileName || "CV Document"}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '480px',
                border: 'none',
                background: '#181420',
                flex: 1,
              }}
            />
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{
              display: loading ? 'none' : 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          />
        )}
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

