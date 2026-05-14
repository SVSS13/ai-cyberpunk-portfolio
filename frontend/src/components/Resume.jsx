import { motion } from "framer-motion";

import { FaDownload, FaFileAlt, FaCloudDownloadAlt } from "react-icons/fa";

import resume from "../assets/resume.pdf";

import API from "../services/api";
import Reveal from "./Reveal";

function Resume() {
  const downloadResume = async () => {
    try {
      await API.post("resume-download/");

      window.open(resume);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Reveal>
      <section className="section">
        <div
          className="
            relative
            overflow-hidden
            glass
            rounded-[40px]
            border
            border-cyan-500/20
            p-12
            md:p-16
            text-center
            hover:border-cyan-400
            hover:shadow-[0_0_50px_#00FFFF33]
            transition-all
            duration-500
          "
        >
          <div
            className="
              absolute
              top-[-120px]
              left-[-120px]
              w-[250px]
              h-[250px]
              bg-cyan-500/10
              blur-[120px]
              rounded-full
            "
          />

          <div
            className="
              absolute
              bottom-[-120px]
              right-[-120px]
              w-[250px]
              h-[250px]
              bg-pink-500/10
              blur-[120px]
              rounded-full
            "
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div
              className="
                mx-auto
                w-28
                h-28
                rounded-full
                bg-cyan-400
                text-black
                flex
                items-center
                justify-center
                text-5xl
                shadow-[0_0_40px_#00FFFF]
                mb-10
              "
            >
              <FaFileAlt />
            </div>

            <h2
              className="
                text-4xl
                md:text-5xl
                font-black
                neonText
                mb-8
              "
            >
              Resume & Credentials
            </h2>

            <p
              className="
                max-w-3xl
                mx-auto
                text-lg
                md:text-xl
                leading-9
                text-gray-300
              "
            >
              Explore my professional journey, technical expertise,
              certifications, project experience and futuristic development
              capabilities.
            </p>

            <div
              className="
                mt-14
                flex
                flex-wrap
                justify-center
                gap-8
              "
            >
              <div
                className="
                  glass
                  rounded-2xl
                  px-8
                  py-6
                  border
                  border-cyan-500/10
                  min-w-[180px]
                "
              >
                <h3 className="text-4xl font-black neonText">12+</h3>

                <p className="text-gray-400 mt-3">Technical Skills</p>
              </div>

              <div
                className="
                  glass
                  rounded-2xl
                  px-8
                  py-6
                  border
                  border-pink-500/10
                  min-w-[180px]
                "
              >
                <h3 className="text-4xl font-black neonPink">4+</h3>

                <p className="text-gray-400 mt-3">Major Projects</p>
              </div>

              <div
                className="
                  glass
                  rounded-2xl
                  px-8
                  py-6
                  border
                  border-purple-500/10
                  min-w-[180px]
                "
              >
                <h3 className="text-4xl font-black gradientText">AI</h3>

                <p className="text-gray-400 mt-3">Future Focus</p>
              </div>
            </div>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={downloadResume}
              className="
                mt-14
                inline-flex
                items-center
                gap-4
                px-10
                py-5
                rounded-full
                bg-cyan-400
                text-black
                font-bold
                text-lg
                hover:shadow-[0_0_40px_#00FFFF]
                transition-all
                duration-300
              "
            >
              <FaDownload />
              Download Resume
              <FaCloudDownloadAlt />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </Reveal>
  );
}

export default Resume;
