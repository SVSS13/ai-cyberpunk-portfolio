import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { title: "About", href: "#about" },
  { title: "Skills", href: "#skills" },
  { title: "Projects", href: "#projects" },
  { title: "Contact", href: "#contact" },
];

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

  const navClass = `
    fixed
    top-0
    left-0
    w-full
    z-50
    transition-all
    duration-500
    ${
      scrolled
        ? IS_LOW
          ? "bg-black/80 border-b border-cyan-500/30 shadow-[0_0_25px_#00FFFF22]"
          : "bg-black/60 backdrop-blur-xl border-b border-cyan-500/30 shadow-[0_0_25px_#00FFFF22]"
        : "bg-transparent"
    }
  `;

  return (
    <motion.nav
      initial={IS_LOW ? false : { y: -80 }}
      animate={IS_LOW ? false : { y: 0 }}
      transition={{ duration: IS_MEDIUM ? 0.35 : 0.7 }}
      className={navClass}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-5">
        {IS_LOW ? (
          <h1
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
          </h1>
        ) : (
          <motion.h1
            whileHover={IS_MEDIUM ? {} : { scale: 1.05 }}
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
        )}

        <div className="hidden md:flex gap-10 text-lg font-medium">
          {navLinks.map((link, index) =>
            IS_LOW ? (
              <a
                key={index}
                href={link.href}
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
              </a>
            ) : (
              <motion.a
                key={index}
                href={link.href}
                whileHover={IS_MEDIUM ? {} : { y: -3 }}
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
            ),
          )}
        </div>

        <div className="hidden md:flex gap-5 text-2xl">
          {IS_LOW ? (
            <>
              <a
                href="https://github.com/SVSS13"
                target="_blank"
                className="
                  hover:text-cyan-400
                  hover:shadow-[0_0_15px_#00FFFF]
                  transition-[color,box-shadow]
                  duration-300
                "
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/svss13"
                target="_blank"
                className="
                  hover:text-pink-500
                  hover:drop-shadow-[0_0_15px_#FF00FF]
                  transition-all
                  duration-300
                "
              >
                <FaLinkedin />
              </a>
            </>
          ) : (
            <>
              <motion.a
                whileHover={IS_MEDIUM ? {} : { scale: 1.2 }}
                href="https://github.com/SVSS13"
                target="_blank"
                className="
                  hover:text-cyan-400
                  hover:shadow-[0_0_15px_#00FFFF]
                  transition-[color,box-shadow]
                  duration-300
                "
              >
                <FaGithub />
              </motion.a>
              <motion.a
                whileHover={IS_MEDIUM ? {} : { scale: 1.2 }}
                href="https://www.linkedin.com/in/svss13"
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
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={IS_LOW ? false : { opacity: 0, y: -20 }}
            animate={IS_LOW ? false : { opacity: 1, y: 0 }}
            exit={IS_LOW ? false : { opacity: 0, y: -20 }}
            transition={{ duration: IS_MEDIUM ? 0.15 : 0.3 }}
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
