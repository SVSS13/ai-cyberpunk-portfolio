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
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [booting, setBooting] = useState(true);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "🚀 Welcome to Sujal's AI Agent System.\n\nI can search portfolios, GitHub, and the web to answer your questions with verified sources.",
      time: new Date().toLocaleTimeString(),
      confidence: 1.0,
      sources: [],
      tools_used: [],
    },
  ]);

  const messagesEndRef = useRef(null);

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
    messagesEndRef.current?.scrollIntoView({
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
     SEND MESSAGE
  ========================= */
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");

    try {
      setLoading(true);

      const res = await API.post("chatbot/", {
        message: currentMessage,
      });

      const data = res.data;
      const fullText = data.reply;

      // DEBUG: Log raw data from backend
      console.log("RAW backend data:", JSON.stringify(data, null, 2));
      console.log("Sources count:", data.sources?.length);
      console.log("Sources:", data.sources);

      // Agent metadata
      const agentData = {
        confidence: data.confidence ?? 0,
        sources: data.sources ?? [],
        tools_used: data.tools_used ?? [],
        intent: data.intent ?? "general",
      };

      if (IS_LOW) {
        const botMessage = {
          sender: "bot",
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
          sender: "bot",
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
          sender: "bot",
          text: "⚠️ AI system temporarily unavailable.",
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

    // DEDUPLICATE: Create unique sources by URL+title
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
    const isBot = msg.sender === "bot";

    const bubbleContent = (
      <div
        className={`
          max-w-[88%]
          px-5
          py-4
          rounded-3xl
          text-sm
          leading-7
          relative
          ${
            msg.sender === "user"
              ? "ml-auto bg-cyan-400 text-black"
              : "bg-[#111827] border border-cyan-500/10 text-gray-300"
          }
        `}
      >
        <ReactMarkdown>{msg.text}</ReactMarkdown>

        {/* Agent metadata for bot messages */}
        {isBot && (
          <div className="mt-3 space-y-2">
            {/* Confidence & Tools row */}
            <div className="flex flex-wrap items-center gap-2">
              {msg.confidence !== undefined && (
                <ConfidenceBadge score={msg.confidence} />
              )}
            </div>

            {/* Tools used */}
            <ToolsBadge tools={msg.tools_used} />

            {/* Sources */}
            <SourcesList sources={msg.sources} />

            {/* Time & TTS */}
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

        {/* Simple time for user */}
        {msg.sender === "user" && (
          <div className="text-right text-[10px] opacity-60 mt-1">
            {msg.time}
          </div>
        )}
      </div>
    );

    if (IS_LOW) {
      return (
        <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
          {isBot && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
              <FaRobot className="w-4 h-4 text-white" />
            </div>
          )}
          {bubbleContent}
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isBot ? "justify-start" : "justify-end"}`}
      >
        {isBot && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
            <FaRobot className="w-4 h-4 text-white" />
          </div>
        )}
        {bubbleContent}
      </motion.div>
    );
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="fixed bottom-8 right-6 z-50">
      {/* TOGGLE BUTTON */}
      {IS_LOW ? (
        <button
          onClick={() => setOpen(!open)}
          className="
            w-16
            h-16
            rounded-full
            bg-cyan-400
            text-black
            flex
            items-center
            justify-center
            text-3xl
            shadow-[0_0_30px_#00FFFF]
            hover:shadow-[0_0_50px_#00FFFF]
            transition-all
            duration-300
          "
        >
          {open ? <FaTimes /> : <FaRobot />}
        </button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="
            w-16
            h-16
            rounded-full
            bg-cyan-400
            text-black
            flex
            items-center
            justify-center
            text-3xl
            shadow-[0_0_30px_#00FFFF]
            hover:shadow-[0_0_50px_#00FFFF]
            transition-all
            duration-300
          "
        >
          {open ? <FaTimes /> : <FaRobot />}
        </motion.button>
      )}

      <AnimatePresence>
        {open &&
          (booting ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: IS_MEDIUM ? 0.15 : 0.3 }}
              className="
                mt-5
                w-[420px]
                h-[600px]
                rounded-[35px]
                glass
                border
                border-cyan-500/20
                bg-black/80
                p-6
                font-mono
                text-sm
                text-cyan-400
                overflow-hidden
              "
            >
              <div className="space-y-3">
                <p>{">"} Initializing Agent System...</p>
                <p>{">"} Loading Portfolio Database...</p>
                <p>{">"} Connecting Web Search...</p>
                <p>{">"} Loading GitHub Integration...</p>
                <p>{">"} Agent Online ✅</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.9 }}
              transition={{ duration: IS_MEDIUM ? 0.2 : 0.35 }}
              className="
                mt-5
                w-[420px]
                h-[600px]
                glass
                rounded-[35px]
                border
                border-cyan-500/20
                overflow-hidden
                shadow-[0_0_50px_#00FFFF22]
                backdrop-blur-xl
                flex
                flex-col
              "
            >
              {/* HEADER */}
              <div
                className="
                  flex
                  items-center
                  gap-4
                  px-6
                  py-5
                  border-b
                  border-cyan-500/10
                  bg-black/20
                "
              >
                <div
                  className="
                    w-14
                    h-14
                    rounded-full
                    bg-gradient-to-br
                    from-cyan-500
                    to-blue-600
                    text-white
                    flex
                    items-center
                    justify-center
                    text-2xl
                    shadow-[0_0_20px_#00FFFF]
                  "
                >
                  <FaRobot />
                </div>
                <div>
                  <h2 className="font-bold text-xl neonText">AI Agent</h2>
                  <p className="text-sm text-gray-400">
                    Dynamic Discovery • Verified Sources
                  </p>
                </div>
              </div>

              {/* CHAT AREA */}
              <div
                className="
                  flex-1
                  overflow-y-auto
                  p-5
                  space-y-5
                "
              >
                {messages.map((msg, index) => (
                  <MessageBubble key={index} msg={msg} />
                ))}

                {typingText && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="
                      bg-[#111827]
                      border
                      border-cyan-500/10
                      text-gray-300
                      px-5
                      py-4
                      rounded-3xl
                      w-fit
                      max-w-[88%]
                    "
                  >
                    <ReactMarkdown>{typingText}</ReactMarkdown>
                    <span className="animate-pulse text-cyan-400">▋</span>
                  </motion.div>
                )}

                {loading && !typingText && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="
                      bg-[#111827]
                      border
                      border-cyan-500/10
                      text-gray-300
                      px-5
                      py-4
                      rounded-3xl
                      w-fit
                    "
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

                <div ref={messagesEndRef} />
              </div>

              {/* INPUT AREA */}
              <div
                className="
                  p-5
                  border-t
                  border-cyan-500/10
                  flex
                  gap-3
                "
              >
                <input
                  type="text"
                  autoComplete="off"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask the AI agent..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  className="
                    flex-1
                    bg-[#050816]
                    border
                    border-cyan-500/20
                    rounded-2xl
                    px-5
                    py-4
                    outline-none
                    focus:border-cyan-400
                    transition
                    text-sm
                  "
                />

                <button
                  onClick={startListening}
                  className={`
                    w-14
                    h-14
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    ${
                      listening
                        ? "bg-pink-500 text-white shadow-[0_0_25px_#FF00FF]"
                        : "bg-[#111827] text-cyan-400 border border-cyan-500/20"
                    }
                  `}
                >
                  <FaMicrophone />
                </button>

                <button
                  onClick={sendMessage}
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-cyan-400
                    text-black
                    flex
                    items-center
                    justify-center
                    hover:shadow-[0_0_25px_#00FFFF]
                    transition-all
                    duration-300
                  "
                >
                  <FaPaperPlane />
                </button>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

export default ChatBot;
