import { useState } from "react";

import { FaTerminal, FaTimes } from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

function Terminal() {
  const [open, setOpen] = useState(false);

  const [input, setInput] = useState("");

  const [history, setHistory] = useState([
    "Initializing Cyber Terminal...",
    "Portfolio System Online ✅",
    "Type 'help' to view commands.",
  ]);

  const commands = {
    help: `
Available Commands:

help
about
skills
projects
resume
contact
github
clear
whoami
ai
    `,

    about:
      "Sujal is a futuristic full stack developer specializing in AI, DevOps and Cloud Systems.",

    skills:
      "Python, Django, React, Docker, Jenkins, OpenCV, AWS, Machine Learning, MongoDB, MySQL",

    projects: `
1. PCB Defect Detection System
2. Cat vs Dog Classifier
3. Informex Analytics
4. E KART E-Commerce
      `,

    resume: "Resume available in the Resume section.",

    contact: "Email: svss.officia13@gmail.com",

    github: "GitHub: https://github.com/SVSS13",

    whoami: "S V S SUJAL — Build Engineer • AI Developer • Cloud Practitioner",

    ai: "AI Recruiter Assistant Active ✅",
  };

  const handleCommand = () => {
    if (!input.trim()) return;

    const command = input.toLowerCase();

    let output = "";

    if (command === "clear") {
      setHistory([]);

      setInput("");

      return;
    }

    output = commands[command] || `Command not found: ${command}`;

    setHistory((prev) => [...prev, `> ${command}`, output]);

    setInput("");
  };

  return (
    <div className="fixed left-6 bottom-8 z-50">
      <motion.button
        whileHover={{
          scale: 1.1,
        }}
        whileTap={{
          scale: 0.9,
        }}
        onClick={() => setOpen(!open)}
        className="
          w-16
          h-16
          rounded-full
          bg-black
          border
          border-cyan-400
          text-cyan-400
          flex
          items-center
          justify-center
          text-2xl
          shadow-[0_0_25px_#00FFFF]
        "
      >
        {open ? <FaTimes /> : <FaTerminal />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 30,
            }}
            className="
              mt-5
              w-[700px]
              h-[500px]
              bg-black/90
              border
              border-cyan-500/20
              rounded-3xl
              overflow-hidden
              backdrop-blur-xl
              shadow-[0_0_40px_#00FFFF22]
              flex
              flex-col
            "
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-4
                border-b
                border-cyan-500/10
              "
            >
              <h2 className="font-mono neonText">cyber_terminal.exe</h2>

              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />

                <div className="w-3 h-3 rounded-full bg-yellow-500" />

                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>

            {/* BODY */}

            <div
              className="
                flex-1
                overflow-y-auto
                p-5
                font-mono
                text-sm
                text-cyan-400
                space-y-3
              "
            >
              {history.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
            </div>

            {/* INPUT */}

            <div
              className="
                border-t
                border-cyan-500/10
                p-4
                flex
                items-center
                gap-3
              "
            >
              <span className="text-cyan-400 font-mono">$</span>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCommand();
                  }
                }}
                placeholder="Enter command..."
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-cyan-400
                  font-mono
                "
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Terminal;
