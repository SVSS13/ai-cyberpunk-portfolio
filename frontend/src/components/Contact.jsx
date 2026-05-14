import { useState } from "react";

import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";

import { motion } from "framer-motion";

import API from "../services/api";
import Reveal from "./Reveal";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("contact/", form);

      if (res.data.success) {
        alert("🚀 Message sent successfully!");

        setForm({
          name: "",

          email: "",

          message: "",
        });
      } else {
        alert("⚠️ Failed to send message");
      }
    } catch (err) {
      console.log(err);

      const errorMessage = err?.response?.data?.error || "Something went wrong";

      alert(`⚠️ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Reveal>
      <section id="contact" className="section">
        <h2 className="text-4xl md:text-5xl font-bold neonText mb-14">
          Contact
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="
              glass
              rounded-3xl
              p-10
              border
              border-cyan-500/20
              hover:border-cyan-400
              hover:shadow-[0_0_40px_#00FFFF33]
              transition-all
              duration-500
            "
          >
            <div className="space-y-10 text-lg">
              <div className="flex items-center gap-5">
                <div
                  className="
                    w-14
                    h-14
                    rounded-full
                    bg-cyan-400
                    text-black
                    flex
                    items-center
                    justify-center
                    shadow-[0_0_25px_#00FFFF]
                  "
                >
                  <FaEnvelope />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Email</p>

                  <p className="text-lg">svss.officia13@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div
                  className="
                    w-14
                    h-14
                    rounded-full
                    bg-pink-500
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-[0_0_25px_#FF00FF]
                  "
                >
                  <FaPhone />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Phone</p>

                  <p className="text-lg">+91 8105115505</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div
                  className="
                    w-14
                    h-14
                    rounded-full
                    bg-purple-500
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-[0_0_25px_#7F00FF]
                  "
                >
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Location</p>

                  <p className="text-lg">Bengaluru, India</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="
              glass
              rounded-3xl
              p-10
              border
              border-cyan-500/20
              hover:border-cyan-400
              hover:shadow-[0_0_40px_#00FFFF33]
              transition-all
              duration-500
              space-y-7
            "
          >
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="
                w-full
                p-5
                rounded-xl
                bg-[#050816]
                border
                border-cyan-500/20
                focus:border-cyan-400
                outline-none
                transition
              "
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="
                w-full
                p-5
                rounded-xl
                bg-[#050816]
                border
                border-cyan-500/20
                focus:border-cyan-400
                outline-none
                transition
              "
            />

            <textarea
              rows="6"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              className="
                w-full
                p-5
                rounded-xl
                bg-[#050816]
                border
                border-cyan-500/20
                focus:border-cyan-400
                outline-none
                transition
                resize-none
              "
            />

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                items-center
                gap-3
                px-8
                py-4
                rounded-full
                bg-cyan-400
                text-black
                font-bold
                hover:scale-105
                hover:shadow-[0_0_30px_#00FFFF]
                transition-all
                duration-300
              "
            >
              <FaPaperPlane />

              {loading ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        </div>
      </section>
    </Reveal>
  );
}

export default Contact;
