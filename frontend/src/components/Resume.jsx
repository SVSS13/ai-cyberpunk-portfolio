import { motion } from 'framer-motion';
import API from '../services/api';

const HL = [
  { icon: '🚀', label: '3+',  sub: 'Years Exp.'      },
  { icon: '📦', label: '20+', sub: 'Projects'        },
  { icon: '☁',  label: 'AWS', sub: 'Certified Cloud' },
  { icon: '🤖', label: 'AI',  sub: 'ML & NLP'        },
];

const VP = { once: true, amount: 0.1 };

export default function Resume() {
  const handleDownload = async () => {
    try { await API.post('resume-download/'); } catch {}
    const a = document.createElement('a');
    a.href = '/assets/resume.pdf'; a.download = 'SVS_Sujal_Resume.pdf'; a.click();
  };

  return (
    <section id="resume" className="section">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP}
        style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 8 }}>
        // CREDENTIALS
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP} transition={{ delay: 0.05 }} className="section-title">
        My <span className="neon-gold">Résumé</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP} transition={{ delay: 0.1 }} className="section-subtitle">
        Everything packaged in one document.
      </motion.p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 40 }}>
        {HL.map((h, i) => (
          <motion.div key={h.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP} transition={{ delay: 0.1 + i * 0.08 }}
            className="glass-card-sm" style={{ textAlign: 'center', padding: '22px 12px' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{h.icon}</div>
            <div style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--cyan)', lineHeight: 1 }}>{h.label}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>{h.sub}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP} transition={{ delay: 0.3 }}
        className="glass-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 20 }}>📄</div>
        <h3 style={{ fontWeight: 900, fontSize: '1.6rem', marginBottom: 12 }}>Ready to <span className="neon-cyan">launch</span> together?</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
          Download my full résumé for a comprehensive overview of skills, projects, and experience.
        </p>
        <button onClick={handleDownload} className="btn-primary" style={{ fontSize: '1rem', padding: '14px 40px' }}>
          &#11015; Download Résumé
        </button>
      </motion.div>
    </section>
  );
}
