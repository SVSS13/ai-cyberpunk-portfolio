import { useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import Reveal from "./Reveal";

// ===== DEVICE DETECTION (inline) =====
const getDeviceTier = () => {
  if (typeof window === "undefined") return "high";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return "low";
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  if (cores <= 4 && memory <= 4) return "low";
  if (cores <= 6) return "medium";
  return "high";
};

const TIER = getDeviceTier();
const IS_LOW = TIER === "low";
const IS_MEDIUM = TIER === "medium";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("contact/", formData);

      if (res.data.success) {
        alert("Message sent successfully!");

        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        alert("Failed to send message");
      }
    } catch (err) {
      console.log(err);

      const errorMessage = err?.response?.data?.error || "Something went wrong";

      alert(`${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Reveal>
      <section id="contact" className="section">
        <h2 className="text-4xl md:text-5xl font-bold neonPink mb-14">
          Contact
        </h2>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={IS_LOW ? false : { opacity: 0, x: -30 }}
            whileInView={IS_LOW ? false : { opacity: 1, x: 0 }}
            transition={{ duration: IS_MEDIUM ? 0.4 : 0.7 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-2xl">
                📧
              </div>
              <div>
                <h3 className="text-white font-semibold">Email</h3>
                <p className="text-gray-400">svss.officia13@gmail.com</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-2xl">
                📱
              </div>
              <div>
                <h3 className="text-white font-semibold">Phone</h3>
                <p className="text-gray-400">+91 8105115505</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl">
                📍
              </div>
              <div>
                <h3 className="text-white font-semibold">Location</h3>
                <p className="text-gray-400">Bengaluru, India</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={IS_LOW ? false : { opacity: 0, x: 30 }}
            whileInView={IS_LOW ? false : { opacity: 1, x: 0 }}
            transition={{ duration: IS_MEDIUM ? 0.4 : 0.7 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-8 space-y-6"
          >
            <div>
              <label className="block text-gray-400 mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#111827] border border-gray-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Your Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#111827] border border-gray-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Message</label>
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#111827] border border-gray-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-cyan-500 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </motion.form>
        </div>
      </section>
    </Reveal>
  );
}

export default Contact;
