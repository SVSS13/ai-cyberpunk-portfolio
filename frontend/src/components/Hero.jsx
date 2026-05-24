import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaDownload } from "react-icons/fa";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import CyberSphere from "./CyberSphere";
import profile from "../assets/profile.png";
import resume from "../assets/resume.pdf";
import API from "../services/api";

function Hero() {
  const handleResumeDownload = async () => {
    console.log(
      "[DEBUG Hero] Resume click, platform:",
      Capacitor.getPlatform(),
    );

    try {
      await API.post("resume-download/");
      console.log("[DEBUG Hero] API tracking success");

      if (Capacitor.isNativePlatform()) {
        console.log("[DEBUG Hero] Native - downloading to device");

        // Fetch PDF
        const response = await fetch(resume);
        const blob = await response.blob();

        // Convert to base64
        const reader = new FileReader();
        const base64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.readAsDataURL(blob);
        });

        // Save to Downloads
        const fileName = "Sujal_Surampudi_Resume.pdf";
        await Filesystem.writeFile({
          path: fileName,
          data: base64,
          directory: Directory.Documents,
        });

        const file = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Documents,
        });

        console.log("[DEBUG Hero] Saved to:", file.uri);

        // Share so user can open it
        await Share.share({
          title: "Resume Downloaded",
          text: "My Resume",
          url: file.uri,
          dialogTitle: "Open Resume",
        });

        console.log("[DEBUG Hero] Share dialog opened");
      } else {
        console.log("[DEBUG Hero] Web - opening browser");
        await Browser.open({ url: resume });
      }
    } catch (err) {
      console.error("[DEBUG Hero] Error:", err.message || err);
      window.open(resume, "_blank");
    }
  };

  return (
    <section
      className="
        relative
        min-h-screen
        flex
        items-center
        justify-center
        px-6
        overflow-hidden
      "
    >
      <CyberSphere />
      <div
        className="
          absolute
          top-0
          left-0
          w-[500px]
          h-[500px]
          bg-cyan-500/20
          blur-[140px]
          rounded-full
          -z-10
        "
      />

      <div
        className="
          absolute
          bottom-0
          right-0
          w-[500px]
          h-[500px]
          bg-pink-500/20
          blur-[140px]
          rounded-full
          -z-10
        "
      />

      <div className="grid md:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="
              uppercase
              tracking-[6px]
              text-cyan-400
              mb-5
              text-sm
            "
          >
            PROFESSIONAL PORTFOLIO
          </motion.p>

          <h1
            className="
              text-6xl
              md:text-8xl
              font-black
              leading-tight
            "
          >
            S V S
            <br />
            <span
              className="
                neonText
                drop-shadow-[0_0_25px_#00FFFF]
              "
            >
              SUJAL
            </span>
          </h1>

          <div
            className="
              mt-8
              text-2xl
              md:text-4xl
              font-semibold
              min-h-[70px]
            "
          >
            <TypeAnimation
              sequence={[
                "Build Engineer",
                2000,
                "OPEN TO WORK",
                2000,
                "Full Stack Developer",
                2000,
                "DevOps Enthusiast",
                2000,
                "AI & ML Explorer",
                2000,
              ]}
              speed={50}
              repeat={Infinity}
              className="neonPink"
            />
          </div>

          <p
            className="
              mt-10
              text-gray-300
              leading-9
              text-lg
              max-w-2xl
            "
          >
            Passionate about building futuristic digital experiences using AI
            systems, DevOps automation, cloud infrastructure and scalable full
            stack technologies.
          </p>

          <div className="flex gap-6 mt-12 flex-wrap">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="
                px-8
                py-4
                rounded-full
                border
                border-cyan-400
                hover:bg-cyan-400
                hover:text-black
                hover:shadow-[0_0_30px_#00FFFF]
                transition-all
                duration-300
                font-semibold
              "
            >
              Explore Projects
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResumeDownload}
              className="
                flex
                items-center
                gap-3
                px-8
                py-4
                rounded-full
                bg-pink-500
                hover:bg-cyan-400
                hover:text-black
                hover:shadow-[0_0_30px_#00FFFF]
                transition-all
                duration-300
                font-semibold
              "
            >
              <FaDownload />
              Resume
            </motion.button>
          </div>

          <div className="flex gap-6 mt-12 text-3xl">
            <motion.a
              whileHover={{ scale: 1.2 }}
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
              whileHover={{ scale: 1.2 }}
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
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div
              className="
                absolute
                inset-0
                rounded-full
                bg-cyan-400/20
                blur-3xl
                scale-110
                animate-pulse
              "
            />

            <motion.img
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              src={profile}
              alt="Profile"
              className="
                relative
                w-80
                h-80
                md:w-[420px]
                md:h-[420px]
                rounded-full
                border-4
                border-cyan-400
                object-cover
                shadow-[0_0_60px_#00FFFF]
                hover:shadow-[0_0_90px_#00FFFF]
                transition-all
                duration-500
              "
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
