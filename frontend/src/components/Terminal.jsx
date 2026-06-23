import { useState, useRef, useEffect } from "react";
import { FaTerminal, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api"; // Connect to your AI backend

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

// Static variants
const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

const panelVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 30 },
};

function Terminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    "Initializing Cyber Terminal...",
    "Portfolio System Online ✅",
    "Type 'help' to view commands.",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const terminalRef = useRef(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Static commands (instant response)
  const staticCommands = {
    help: `Available Commands:

help        - Show this help message
about       - About Sujal
skills      - Technical skills
projects    - List of projects
resume      - Resume info
contact     - Contact information
github      - GitHub profile
whoami      - Current user info
ai <msg>    - Talk to AI Recruiter
clear       - Clear terminal
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

    resume:
      "Resume available in the Resume section. Download tracked automatically.",

    contact: "Email: svss.officia13@gmail.com",

    github: "GitHub: https://github.com/SVSS13",

    whoami: "S V S SUJAL — Build Engineer • AI Developer • Cloud Practitioner",
  };

  const handleCommand = async () => {
    if (!input.trim()) return;

    const command = input.toLowerCase().trim();
    const args = command.split(" ");
    const cmd = args[0];

    // Handle clear command
    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    // Handle AI command (async - calls backend)
    if (cmd === "ai") {
      const message = args.slice(1).join(" ") || "Hello";
      setIsLoading(true);
      setHistory((prev) => [...prev, `> ${input}`, "🤖 Thinking..."]);

      try {
        const response = await API.post("chatbot/", { message });
        const data = response.data;

        let aiReply = data.reply || "No response from AI";

        // Add sources if available
        if (data.sources && data.sources.length > 0) {
          aiReply += "\n\n📚 Sources:";
          data.sources.forEach((src, i) => {
            aiReply += `\n  ${i + 1}. ${src.title}`;
          });
        }

        setHistory((prev) => [
          ...prev.slice(0, -1), // Remove "Thinking..."
          aiReply,
        ]);
      } catch (err) {
        setHistory((prev) => [
          ...prev.slice(0, -1), // Remove "Thinking..."
          "❌ Error: AI service unavailable. Try again later.",
        ]);
      } finally {
        setIsLoading(false);
        setInput("");
      }
      return;
    }

    // Handle static commands
    const output =
      staticCommands[cmd] ||
      `Command not found: ${cmd}\nType 'help' for available commands.`;
    setHistory((prev) => [...prev, `> ${input}`, output]);
    setInput("");
  };

  // Low-end: no Framer Motion animations
  if (IS_LOW) {
    return (
      <div className="fixed left-6 bottom-8 z-50">
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle terminal"
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
            hover:shadow-[0_0_35px_#00FFFF]
            transition-shadow
          "
        >
          {open ? <FaTimes /> : <FaTerminal />}
        </button>

        {open && (
          <div
            className="
              mt-5
              w-[90vw]
              max-w-[700px]
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

            <div
              ref={terminalRef}
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
              {isLoading && (
                <div className="animate-pulse text-cyan-600">...</div>
              )}
            </div>

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
                name="terminal-command"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCommand();
                  }
                }}
                placeholder="Enter command..."
                disabled={isLoading}
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-cyan-400
                  font-mono
                  placeholder-cyan-700
                "
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed left-6 bottom-8 z-50">
      <motion.button
        whileHover={IS_MEDIUM ? {} : { scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        aria-label="Toggle terminal"
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
          hover:shadow-[0_0_35px_#00FFFF]
          transition-shadow
        "
      >
        {open ? <FaTimes /> : <FaTerminal />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: IS_MEDIUM ? 0.2 : 0.3 }}
            className="
              mt-5
              w-[90vw]
              max-w-[700px]
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

            <div
              ref={terminalRef}
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
              {isLoading && (
                <div className="animate-pulse text-cyan-600">...</div>
              )}
            </div>

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
                name="terminal-command"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCommand();
                  }
                }}
                placeholder="Enter command..."
                disabled={isLoading}
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-cyan-400
                  font-mono
                  placeholder-cyan-700
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
