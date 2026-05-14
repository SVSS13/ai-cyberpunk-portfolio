import { FaGithub, FaLinkedin, FaArrowUp } from "react-icons/fa";

import { motion } from "framer-motion";

function Footer() {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className="
        relative
        mt-24
        border-t
        border-cyan-500/20
        overflow-hidden
      "
    >
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-cyan-500/5
          to-transparent
          pointer-events-none
        "
      />

      <div className="max-w-7xl mx-auto px-6 py-14 relative z-10">
        <div
          className="
            flex
            flex-col
            md:flex-row
            justify-between
            items-center
            gap-10
          "
        >
          <div>
            <motion.h2
              whileHover={{ scale: 1.03 }}
              className="
                text-3xl
                font-black
                neonText
                tracking-wider
              "
            >
              SVS.SUJAL
            </motion.h2>

            <p className="text-gray-400 mt-4 leading-8 max-w-md">
              Building futuristic digital experiences through AI, cloud systems,
              DevOps and modern full stack technologies.
            </p>
          </div>

          <div className="flex gap-6 text-3xl">
            <motion.a
              whileHover={{
                scale: 1.2,
                y: -4,
              }}
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
              whileHover={{
                scale: 1.2,
                y: -4,
              }}
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
        </div>

        <div
          className="
            mt-14
            pt-8
            border-t
            border-cyan-500/10
            flex
            flex-col
            md:flex-row
            justify-between
            items-center
            gap-6
          "
        >
          <p className="text-gray-500 text-center">
            © 2026 S V S SUJAL • Futuristic Cyberpunk Portfolio
          </p>

          <motion.button
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={scrollTop}
            className="
              flex
              items-center
              gap-3
              px-6
              py-3
              rounded-full
              border
              border-cyan-500
              hover:bg-cyan-400
              hover:text-black
              hover:shadow-[0_0_30px_#00FFFF]
              transition-all
              duration-300
            "
          >
            <FaArrowUp />
            Back To Top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
