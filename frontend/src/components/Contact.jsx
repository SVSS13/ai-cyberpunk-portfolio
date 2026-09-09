import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import API from '../services/api';

const INFO = [
  { icon: '✉', label: 'Email',    val: 'svss.officia13@gmail.com', href: 'mailto:svss.officia13@gmail.com', color: '#00d4ff' },
  { icon: '⑂', label: 'GitHub',   val: 'github.com/SVSS13',         href: 'https://github.com/SVSS13',       color: '#9b59ff' },
  { icon: 'in', label: 'LinkedIn', val: 'linkedin.com/in/svss13',    href: 'https://linkedin.com/in/svss13',  color: '#0077b5' },
];

export default function Contact() {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await API.post('contact/', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="contact" className="section" ref={ref}>
      <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 8 }}>
        // COMMS
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="section-title">
        Get in <span className="neon-cyan">Touch</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="section-subtitle">
        Open channel. Let's build something legendary.
      </motion.p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 28, alignItems: 'start' }}>
        {/* Left: info */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }} className="glass-card">
          <h3 style={{ fontWeight: 800, marginBottom: 8, fontSize: '1.1rem' }}>Let's Connect</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: 28 }}>
            Whether it's a job offer, collaboration, or just a chat about tech — I'm always open to new connections.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {INFO.map(i => (
              <a key={i.label} href={i.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 14, background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${i.color}55`; e.currentTarget.style.background = `${i.color}0d`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)'; e.currentTarget.style.background = 'rgba(0,212,255,0.04)'; }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${i.color}18`, border: `1px solid ${i.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: i.color, fontWeight: 700 }}>{i.icon}</div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{i.label}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{i.val}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.9rem' }}>↗</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 }} className="glass-card">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚀</div>
                <h3 style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 8 }}>Message Launched!</h3>
                <p style={{ color: 'var(--text-muted)' }}>I'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <h3 style={{ fontWeight: 800, marginBottom: 4 }}>Send a Message</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>NAME</label>
                    <input className="bento-input" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>EMAIL</label>
                    <input className="bento-input" type="email" placeholder="john@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>MESSAGE</label>
                  <textarea className="bento-input" rows={5} placeholder="Let's build something amazing together..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required style={{ resize: 'vertical' }} />
                </div>
                {status === 'error' && (
                  <p style={{ color: 'var(--red)', fontSize: '0.82rem', fontWeight: 600 }}>⚠ Failed to send. Please try email directly.</p>
                )}
                <button type="submit" className="btn-primary" disabled={status === 'sending'} style={{ width: '100%', justifyContent: 'center' }}>
                  {status === 'sending' ? '⟳ Sending...' : '⚡ Send Message →'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`@media(max-width:700px){#contact .section > div:last-of-type{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
