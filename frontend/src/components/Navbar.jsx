import { useEffect, useState } from "react";

import { FaGithub, FaLinkedin, FaBars, FaTimes } from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { title: "About", href: "#about" },
  { title: "Skills", href: "#skills" },
  { title: "Projects", href: "#projects" },
  { title: "Contact", href: "#contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7 }}
      className={`
        fixed
        top-0
        left-0
        w-full
        z-50
        transition-all
        duration-500
        ${
          scrolled
            ? "bg-black/60 backdrop-blur-xl border-b border-cyan-500/30 shadow-[0_0_25px_#00FFFF22]"
            : "bg-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-5">
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="
            text-2xl
            md:text-3xl
            font-black
            tracking-wider
            neonText
            cursor-pointer
          "
        >
          SVS.SUJAL
        </motion.h1>

        <div className="hidden md:flex gap-10 text-lg font-medium">
          {navLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              whileHover={{ y: -3 }}
              className="
                relative
                hover:text-cyan-400
                transition-all
                duration-300
                hover:drop-shadow-[0_0_12px_#00FFFF]
                after:absolute
                after:left-0
                after:-bottom-1
                after:h-[2px]
                after:w-0
                after:bg-cyan-400
                after:transition-all
                after:duration-300
                hover:after:w-full
              "
            >
              {link.title}
            </motion.a>
          ))}
        </div>

        <div className="hidden md:flex gap-5 text-2xl">
          <motion.a
            whileHover={{ scale: 1.2 }}
            href="https://github.com/SVSS13"
            target="_blank"
            className="
              hover:text-cyan-400
              hover:drop-shadow-[0_0_15px_#00FFFF]
              transition-all
              duration-300
            "
          >
            <FaGithub />
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.2 }}
            href="https://www.linkedin.com/in/svs-sujal-05219a316"
            target="_blank"
            className="
              hover:text-pink-500
              hover:drop-shadow-[0_0_15px_#FF00FF]
              transition-all
              duration-300
            "
          >
            <FaLinkedin />
          </motion.a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="
              md:hidden
              glass
              mx-4
              mb-4
              rounded-3xl
              p-6
              border
              border-cyan-500/20
              backdrop-blur-xl
            "
          >
            <div className="flex flex-col gap-6 text-lg">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="
                    hover:text-cyan-400
                    transition
                    duration-300
                  "
                >
                  {link.title}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
