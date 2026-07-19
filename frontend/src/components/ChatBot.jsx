import { useEffect, useRef, useState } from "react";
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaMicrophone,
  FaVolumeUp,
  FaSearch,
  FaDatabase,
  FaGithub,
  FaGlobe,
  FaUserSecret,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import API from "../services/api";

// ===== DEVICE DETECTION =====
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

// Tool icon mapping
const TOOL_ICONS = {
  portfolio_search: <FaDatabase className="text-cyan-400" />,
  web_search: <FaGlobe className="text-blue-400" />,
  github_search: <FaGithub className="text-purple-400" />,
  identity_discovery: <FaUserSecret className="text-pink-400" />,
};

const CONFIDENCE_COLORS = {
  high: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  low: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [booting, setBooting] = useState(true);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Welcome to Sujal's AI Agent System. I can search portfolios, GitHub, and the web to answer your questions with verified sources.",
      time: new Date().toLocaleTimeString(),
      confidence: 1.0,
      sources: [],
      tools_used: [],
    },
  ]);

  const bottomRef = useRef(null);

  /* =========================
     BOOT SEQUENCE
  ========================= */
  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), IS_LOW ? 500 : 2500);
    return () => clearTimeout(timer);
  }, []);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: IS_LOW ? "auto" : "smooth",
    });
  }, [messages, typingText]);

  /* =========================
     SPEECH TO TEXT
  ========================= */
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
  };

  /* =========================
     TEXT TO SPEECH
  ========================= */
  const speakMessage = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  };

  /* =========================
     SEND MESSAGE (API)
  ========================= */
  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = {
      type: "user",
      text: message.trim(),
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentMessage = message;
    setMessage("");

    try {
      setLoading(true);

      const res = await API.post("chatbot/", {
        message: currentMessage,
      });

      const data = res.data;
      const fullText = data.reply;

      // Agent metadata
      const agentData = {
        confidence: data.confidence ?? 0,
        sources: data.sources ?? [],
        tools_used: data.tools_used ?? [],
        intent: data.intent ?? "general",
      };

      if (IS_LOW) {
        const botMessage = {
          type: "bot",
          text: fullText,
          time: new Date().toLocaleTimeString(),
          ...agentData,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        let currentText = "";
        setTypingText("");

        const typeSpeed = IS_MEDIUM ? 5 : 10;

        for (let i = 0; i < fullText.length; i++) {
          currentText += fullText[i];
          setTypingText(currentText);
          await new Promise((resolve) => setTimeout(resolve, typeSpeed));
        }

        const botMessage = {
          type: "bot",
          text: fullText,
          time: new Date().toLocaleTimeString(),
          ...agentData,
        };

        setMessages((prev) => [...prev, botMessage]);
        setTypingText("");
      }
    } catch (err) {
      console.log("Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "AI system temporarily unavailable.",
          time: new Date().toLocaleTimeString(),
          confidence: 0,
          sources: [],
          tools_used: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  /* =========================
     CONFIDENCE BADGE
  ========================= */
  const ConfidenceBadge = ({ score }) => {
    const level = score >= 0.8 ? "high" : score >= 0.5 ? "medium" : "low";
    const label = score >= 0.8 ? "High" : score >= 0.5 ? "Medium" : "Low";

    return (
      <span
        className={`text-[10px] px-2 py-0.5 rounded-full border ${CONFIDENCE_COLORS[level]}`}
      >
        {label} Confidence ({(score * 100).toFixed(0)}%)
      </span>
    );
  };

  /* =========================
     TOOLS BADGE
  ========================= */
  const ToolsBadge = ({ tools }) => {
    if (!tools || tools.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {tools.map((tool, i) => (
          <span
            key={i}
            className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${
              tool === "send_email"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
            title={tool}
          >
            {tool === "send_email" ? (
              <span>✅</span>
            ) : (
              TOOL_ICONS[tool] || <FaSearch className="text-slate-400" />
            )}
            {tool === "send_email" ? "Email Sent" : tool.replace("_", " ")}
          </span>
        ))}
      </div>
    );
  };

  /* =========================
     SOURCES LIST
  ========================= */
  const SourcesList = ({ sources }) => {
    if (!sources || sources.length === 0) return null;

    const uniqueSources = [];
    const seen = new Set();

    for (const source of sources) {
      const key = `${source.url || ""}:${source.title || ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      uniqueSources.push(source);
    }

    return (
      <div className="mt-3 pt-3 border-t border-slate-800/50">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">
          Sources ({uniqueSources.length})
        </p>
        <div className="space-y-2">
          {uniqueSources.map((source, i) => {
            const typeColors = {
              portfolio: "bg-cyan-400",
              github: "bg-purple-400",
              identity: "bg-pink-400",
              web_search: "bg-blue-400",
              resume: "bg-amber-400",
            };

            const dotColor = typeColors[source.source_type] || "bg-slate-400";
            const displayTitle = source.title || `${source.source_type} Source`;

            return (
              <div
                key={`${source.source_type}-${i}`}
                className="flex items-start gap-2"
              >
                <span
                  className={`w-2 h-2 rounded-full ${dotColor} mt-1.5 flex-shrink-0`}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] text-slate-500 uppercase font-mono">
                    [{source.source_type}]
                  </span>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline block truncate"
                    >
                      {displayTitle}
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 block">
                      {displayTitle}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* =========================
     MESSAGE BUBBLE
  ========================= */
  const MessageBubble = ({ msg }) => {
    const isBot = msg.type === "bot";

    const bubbleContent = (
      <div
        className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${
          msg.type === "user"
            ? "bg-cyan-500 text-black rounded-br-sm"
            : "bg-[#111827] text-gray-300 border border-cyan-500/20 rounded-bl-sm"
        }`}
      >
        <ReactMarkdown>{msg.text}</ReactMarkdown>

        {/* Agent metadata for bot messages */}
        {isBot && (
          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {msg.confidence !== undefined && (
                <ConfidenceBadge score={msg.confidence} />
              )}
            </div>

            <ToolsBadge tools={msg.tools_used} />

            <SourcesList sources={msg.sources} />

            <div className="flex justify-between items-center mt-2 text-[10px] opacity-60">
              <span>{msg.time}</span>
              <button
                onClick={() => speakMessage(msg.text)}
                className="hover:text-cyan-400 transition"
                title="Read aloud"
              >
                <FaVolumeUp />
              </button>
            </div>
          </div>
        )}

        {msg.type === "user" && (
          <div className="text-right text-[10px] opacity-60 mt-1">
            {msg.time}
          </div>
        )}
      </div>
    );

    if (IS_LOW) {
      return (
        <div className={`max-w-[80%] ${isBot ? "mr-auto" : "ml-auto"}`}>
          {bubbleContent}
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-[80%] ${isBot ? "mr-auto" : "ml-auto"}`}
      >
        {bubbleContent}
      </motion.div>
    );
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <>
      {/* TOGGLE BUTTON */}
      {IS_LOW ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center text-2xl font-bold hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-300 hover:scale-110"
        >
          {isOpen ? <FaTimes /> : <FaRobot />}
        </button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-cyan-500 text-black flex items-center justify-center text-2xl font-bold hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-300"
        >
          {isOpen ? <FaTimes /> : <FaRobot />}
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ duration: IS_MEDIUM ? 0.2 : 0.35 }}
            className="fixed bottom-24 right-5 z-50 w-[350px] max-w-[90vw] h-[450px] bg-[#0a0a0f] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.15)] flex flex-col"
          >
            {/* HEADER */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#111827]/50 border-b border-cyan-500/20">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-xl text-cyan-400">
                <FaRobot />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Agent</h3>
                <p className="text-gray-500 text-xs">
                  Dynamic Discovery • Verified Sources
                </p>
              </div>
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {booting ? (
                <div className="space-y-2 font-mono text-sm text-cyan-400 p-2">
                  <p>{">"} Initializing Agent System...</p>
                  <p>{">"} Loading Portfolio Database...</p>
                  <p>{">"} Connecting Web Search...</p>
                  <p>{">"} Loading GitHub Integration...</p>
                  <p>{">"} Agent Online ✅</p>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <MessageBubble key={index} msg={msg} />
                  ))}

                  {typingText && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-3 max-w-[80%] mr-auto"
                    >
                      <ReactMarkdown>{typingText}</ReactMarkdown>
                      <span className="animate-pulse text-cyan-400">▋</span>
                    </motion.div>
                  )}

                  {loading && !typingText && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-3 max-w-[80%] mr-auto"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce delay-100" />
                          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-200" />
                        </div>
                        <span className="text-xs text-slate-500">
                          Searching sources...
                        </span>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
              <div ref={bottomRef} />
            </div>

            {/* INPUT AREA */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-cyan-500/20">
              <input
                type="text"
                autoComplete="off"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-[#111827] border border-gray-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-cyan-500 transition-colors"
                placeholder="Ask the AI agent..."
              />

              <button
                onClick={startListening}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  listening
                    ? "bg-pink-500 text-white shadow-[0_0_15px_#FF00FF]"
                    : "bg-[#111827] text-cyan-400 border border-cyan-500/20"
                }`}
              >
                <FaMicrophone />
              </button>

              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-xl bg-cyan-500 text-black flex items-center justify-center font-bold hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
              >
                <FaPaperPlane />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatBot;
