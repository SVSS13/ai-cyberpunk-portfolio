import { useEffect, useRef, useState } from "react";
import {
  FaPaperPlane,
  FaTimes,
  FaMicrophone,
  FaVolumeUp,
  FaVolumeMute,
  FaDatabase,
  FaGithub,
  FaGlobe,
  FaUserSecret,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import API from "../services/api";
import { useStance } from "../context/StanceContext";

function ChatBot() {
  const { stance } = useStance();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [booting, setBooting] = useState(true);
  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentAudioRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Greetings, traveler. I am **Sujal's AI Spirit Guide**. Ask me anything about his projects, skills, battle experience, or code repositories.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 1.0,
      sources: [],
      tools_used: [],
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  // ── Bulletproof Samurai Audio Engine ──
  const speakMessage = async (text) => {
    // If already playing, stop
    if (isSpeaking && currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsSpeaking(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      return;
    }

    setIsSpeaking(true);
    const cleanText = text.replace(/[*_#`[\]()]/g, "").trim();

    try {
      // 1. Play real streaming Japanese English Samurai audio from Backend
      const audioUrl = `/api/tts/?text=${encodeURIComponent(cleanText.slice(0, 300))}`;
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
      };

      audio.onerror = () => {
        // Fallback to browser SpeechSynthesis if backend audio failed
        playBrowserTTS(cleanText);
      };

      await audio.play();
    } catch {
      // Fallback
      playBrowserTTS(cleanText);
    }
  };

  const playBrowserTTS = (cleanText) => {
    if (!window.speechSynthesis) {
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v =>
      v.lang.startsWith('en') && (
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('guy') ||
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('male')
      )
    ) || voices[0];

    if (maleVoice) speech.voice = maleVoice;
    speech.pitch = 0.74;
    speech.rate = 0.88;
    speech.onend = () => setIsSpeaking(false);
    speech.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(speech);
  };

  // Speech to Text (Microphone)
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported on this browser.");
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

  // Send Message to Django API
  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMsg = {
      type: "user",
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentMessage = message;
    setMessage("");

    try {
      setLoading(true);
      const res = await API.post("chatbot/", { message: currentMessage });
      const data = res.data;
      const fullText = data.reply || "I encountered an issue processing your query.";

      const agentData = {
        confidence: data.confidence ?? 0.95,
        sources: data.sources ?? [],
        tools_used: data.tools_used ?? [],
        intent: data.intent ?? "general",
      };

      let currentText = "";
      setTypingText("");

      for (let i = 0; i < fullText.length; i++) {
        currentText += fullText[i];
        setTypingText(currentText);
        await new Promise((resolve) => setTimeout(resolve, 8));
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: fullText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ...agentData,
        },
      ]);
      setTypingText("");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "I was unable to communicate with the backend spirit realm. Please ensure the Django server is online.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ── Floating Tsushima Trigger Button ── */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 90,
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${stance.secondary}, ${stance.primary})`,
          border: "2px solid rgba(255,255,255,0.3)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.4rem",
          fontWeight: 900,
          cursor: "pointer",
          boxShadow: `0 0 25px ${stance.glow}, 0 8px 30px rgba(0,0,0,0.6)`,
          transition: "box-shadow 0.3s",
        }}
        title="Consult AI Spirit Guide"
      >
        {isOpen ? <FaTimes /> : "⛩️"}
      </motion.button>

      {/* ── Tsushima Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              bottom: 92,
              right: 24,
              zIndex: 90,
              width: 380,
              maxWidth: "calc(100vw - 48px)",
              height: 520,
              background: "rgba(14, 4, 8, 0.95)",
              border: "1px solid var(--glass-border)",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 16px 50px rgba(0,0,0,0.85), 0 0 30px rgba(204,34,51,0.25)",
              backdropFilter: "blur(24px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 18px",
                background: "linear-gradient(90deg, rgba(20,4,8,0.95), rgba(43,7,11,0.95))",
                borderBottom: "1px solid var(--glass-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${stance.secondary}, ${stance.primary})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    color: "#fff",
                    boxShadow: "0 0 12px rgba(255,183,197,0.4)",
                  }}
                >
                  ⛩️
                </div>
                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                    Samurai Voice Guide · 冥人
                  </h3>
                  <p style={{ fontSize: "0.7rem", color: "var(--sakura)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    <span>⚔️ Male Samurai English Voice</span>
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => speakMessage("I am the spirit of the blade. Ask and I shall answer.")}
                  style={{
                    background: isSpeaking ? "var(--crimson)" : "rgba(255,183,197,0.1)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: 8,
                    padding: "4px 10px",
                    color: isSpeaking ? "#fff" : "var(--sakura)",
                    cursor: "pointer",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    transition: "all 0.2s",
                  }}
                  title="Test Samurai Voice"
                >
                  {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
                  {isSpeaking ? "Speaking..." : "Test Voice"}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1rem" }}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {booting ? (
                <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--sakura)", padding: 8, lineHeight: 1.8 }}>
                  <p>&gt; Initializing Samurai Audio Engine...</p>
                  <p>&gt; Communing with Spirit Realm...</p>
                  <p>&gt; Indexing Sakai Knowledge Scroll...</p>
                  <p>&gt; Samurai AI Voice Online ✅</p>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => {
                    const isBot = msg.type === "bot";
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          alignSelf: isBot ? "flex-start" : "flex-end",
                          maxWidth: "85%",
                        }}
                      >
                        <div
                          style={{
                            padding: "10px 14px",
                            borderRadius: isBot ? "14px 14px 14px 2px" : "14px 14px 2px 14px",
                            background: isBot
                              ? "rgba(22, 8, 14, 0.88)"
                              : `linear-gradient(135deg, ${stance.secondary}, ${stance.primary})`,
                            border: isBot ? "1px solid var(--glass-border)" : "none",
                            color: isBot ? "var(--text)" : "#fff",
                            fontSize: "0.85rem",
                            lineHeight: 1.6,
                            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                          }}
                        >
                          <ReactMarkdown>{msg.text}</ReactMarkdown>

                          {/* Bot Metadata & Voice Speaker Button */}
                          {isBot && (
                            <div style={{ marginTop: 8, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                              <span style={{ fontSize: "0.68rem" }}>{msg.time}</span>
                              <button
                                onClick={() => speakMessage(msg.text)}
                                style={{
                                  background: "rgba(255,183,197,0.1)",
                                  border: "1px solid var(--glass-border)",
                                  borderRadius: 6,
                                  padding: "2px 8px",
                                  color: "var(--sakura)",
                                  cursor: "pointer",
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                                title="Hear Samurai Voice"
                              >
                                <FaVolumeUp /> Speak
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Streaming typing text */}
                  {typingText && (
                    <div
                      style={{
                        alignSelf: "flex-start",
                        maxWidth: "85%",
                        padding: "10px 14px",
                        borderRadius: "14px 14px 14px 2px",
                        background: "rgba(22, 8, 14, 0.88)",
                        border: "1px solid var(--glass-border)",
                        color: "var(--text)",
                        fontSize: "0.85rem",
                      }}
                    >
                      <ReactMarkdown>{typingText}</ReactMarkdown>
                      <span style={{ color: "var(--sakura)", animation: "pulse-dot 1s infinite" }}>▋</span>
                    </div>
                  )}

                  {/* Loading */}
                  {loading && !typingText && (
                    <div
                      style={{
                        alignSelf: "flex-start",
                        padding: "8px 14px",
                        borderRadius: 14,
                        background: "rgba(22, 8, 14, 0.88)",
                        border: "1px solid var(--glass-border)",
                        fontSize: "0.78rem",
                        color: "var(--sakura)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span>🌸 Contemplating wisdom...</span>
                    </div>
                  )}
                </>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Box */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 14px",
                borderTop: "1px solid var(--glass-border)",
                background: "rgba(10, 3, 6, 0.95)",
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask the Samurai Spirit..."
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: 12,
                  padding: "8px 12px",
                  color: "#fff",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />

              <button
                onClick={startListening}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: listening ? "var(--crimson)" : "rgba(255,255,255,0.06)",
                  border: "1px solid var(--glass-border)",
                  color: listening ? "#fff" : "var(--sakura)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
                title="Speak to Samurai"
              >
                <FaMicrophone />
              </button>

              <button
                onClick={handleSend}
                disabled={loading}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${stance.secondary}, ${stance.primary})`,
                  border: "none",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  boxShadow: "0 0 12px rgba(204,34,51,0.4)",
                  opacity: loading ? 0.6 : 1,
                }}
                title="Send Message"
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
