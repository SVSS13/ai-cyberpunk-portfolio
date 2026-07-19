import { useState, useRef, useEffect } from "react";

const staticCommands = {
  help: "Available Commands: help, about, skills, projects, resume, contact, github, whoami, clear",
  about:
    "Sujal is a futuristic full stack developer specializing in AI, DevOps and Cloud Systems.",
  skills:
    "Python, Django, React, Docker, Jenkins, OpenCV, AWS, Machine Learning, MongoDB, MySQL",
  projects:
    "1. Aerial Object Detection | 2. AI Cyberpunk Portfolio | 3. Footfall Counter | 4. Pothole Detection System",
  resume:
    "Resume available in the Resume section. Download tracked automatically.",
  contact: "Email: svss.officia13@gmail.com | Phone: +91 8105115505",
  github: "GitHub: https://github.com/SVSS13",
  whoami: "S V S SUJAL — Build Engineer • AI Developer • Cloud Practitioner",
};

function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([
    { type: "output", text: "Initializing Cyber Terminal..." },
    { type: "output", text: "Portfolio System Online" },
    { type: "output", text: "Type 'help' to view commands." },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newHistory = [...history, { type: "input", text: input }];
    const cmd = input.trim().toLowerCase();

    if (cmd === "clear") {
      setHistory([]);
    } else if (staticCommands[cmd]) {
      newHistory.push({ type: "output", text: staticCommands[cmd] });
      setHistory(newHistory);
    } else {
      newHistory.push({
        type: "error",
        text: `Command not found: ${cmd}. Type 'help' for available commands.`,
      });
      setHistory(newHistory);
    }

    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-5 z-50 w-12 h-12 rounded-full bg-[#111827] border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300 hover:scale-110"
      >
        &gt;_
      </button>

      {isOpen && (
        <div className="fixed bottom-36 right-5 z-50 w-[400px] max-w-[90vw] h-[300px] bg-[#0a0a0f] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.15)] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-[#111827]/50 border-b border-cyan-500/20">
            <span className="text-cyan-400 text-sm font-mono">
              cyber_terminal.exe
            </span>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
            {history.map((item, i) => (
              <div key={i} className="mb-2">
                {item.type === "input" && (
                  <div className="text-cyan-400">
                    <span className="text-pink-400">$</span> {item.text}
                  </div>
                )}
                {item.type === "output" && (
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {item.text}
                  </div>
                )}
                {item.type === "error" && (
                  <div className="text-red-400 whitespace-pre-wrap">
                    {item.text}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-3 border-t border-cyan-500/20"
          >
            <span className="text-pink-400 font-mono">$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-cyan-400 font-mono text-sm outline-none"
              placeholder="Enter command..."
              autoFocus
            />
          </form>
        </div>
      )}
    </>
  );
}

export default Terminal;
