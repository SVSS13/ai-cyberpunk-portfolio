import { useEffect, useRef, useState } from "react";
import {
  FaPaperPlane,
  FaTimes,
  FaMicrophone,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import API from "../services/api";
import { useStance } from "../context/StanceContext";
import profilePhoto from "../assets/profile.png";

function ChatBot() {
  const { stance } = useStance();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [booting, setBooting] = useState(true);
  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const currentAudioRef = useRef(null);
  const recognitionRef = useRef(null);

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
    const timer = setTimeout(() => setBooting(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  // Bulletproof Samurai Neural Voice Engine
  const speakMessage = async (text, customPersona = null) => {
    if (isSpeaking && currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsSpeaking(false);
      setAudioLoading(false);
      return;
    }

    const cleanText = text.replace(/[*_#`[\]()<>]/g, "").trim();
    if (!cleanText) return;

    try {
      setAudioLoading(true);

      const response = await API.get(`tts/?text=${encodeURIComponent(cleanText.slice(0, 320))}&persona=ronin`, {
        responseType: "blob",
      });

      const blobUrl = URL.createObjectURL(response.data);
      const audio = new Audio(blobUrl);
      currentAudioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        setAudioLoading(false);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        setAudioLoading(false);
        URL.revokeObjectURL(blobUrl);
        currentAudioRef.current = null;
      };

      audio.onerror = () => {
        setAudioLoading(false);
        URL.revokeObjectURL(blobUrl);
        playBrowserFallback(cleanText);
      };

      await audio.play();
    } catch {
      setAudioLoading(false);
      playBrowserFallback(cleanText);
    }
  };

  const playBrowserFallback = (cleanText) => {
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

    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => setIsSpeaking(false);
    speech.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(speech);
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported on this browser. Please use Google Chrome, Microsoft Edge, or Safari.");
      return;
    }

    if (listening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn("Speech recognition stop:", err);
      }
      setListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (event) => {
        let liveTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          liveTranscript += event.results[i][0].transcript;
        }
        if (liveTranscript) {
          setMessage(liveTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setListening(false);
        }
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setListening(false);
    }
  };

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
          bottom: "clamp(16px, 3vh, 24px)",
          right: "clamp(16px, 3vw, 24px)",
          zIndex: 90,
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${stance.secondary}, ${stance.primary})`,
          border: "2px solid rgba(255,255,255,0.3)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
          fontWeight: 900,
          cursor: "pointer",
          boxShadow: `0 0 25px ${stance.glow}, 0 8px 30px rgba(0,0,0,0.6)`,
          transition: "box-shadow 0.3s",
        }}
        title="Consult AI Spirit Guide"
      >
        {isOpen ? <FaTimes /> : "⛩️"}
      </motion.button>

      {/* ── Tsushima Chat Window (Fully Mobile Responsive) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="tsushima-chat-box"
            style={{
              position: "fixed",
              bottom: "clamp(76px, 10vh, 88px)",
              right: "clamp(12px, 3vw, 24px)",
              zIndex: 90,
              width: 410,
              maxWidth: "calc(100vw - 24px)",
              height: 520,
              maxHeight: "calc(100vh - 110px)",
              background: "rgba(14, 4, 8, 0.96)",
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
                flexDirection: "column",
                padding: "10px 14px",
                background: "linear-gradient(90deg, rgba(20,4,8,0.95), rgba(43,7,11,0.95))",
                borderBottom: "1px solid var(--glass-border)",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ position: "relative", width: 34, height: 34, flexShrink: 0 }}>
                    <img
                      src={profilePhoto}
                      alt="Sujal AI Guide"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `2px solid ${stance.primary}`,
                        boxShadow: `0 0 10px ${stance.glow}`,
                        display: "block",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: "#22c55e",
                        border: "1.5px solid #0e0408",
                        boxShadow: "0 0 6px #22c55e",
                      }}
                      title="Online"
                    />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                      Ronin Voice Guide · 浪人
                    </h3>
                    <p style={{ fontSize: "0.65rem", color: "var(--sakura)", fontWeight: 600 }}>
                      Sujal's AI Spirit Guide
                    </p>
                  </div>
                </div>

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
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {booting ? (
                <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "var(--sakura)", padding: 6, lineHeight: 1.7 }}>
                  <p>&gt; Initializing Samurai Neural Audio Engine...</p>
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
                          maxWidth: "92%",
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                        }}
                      >
                        {isBot && (
                          <img
                            src={profilePhoto}
                            alt="Sujal AI"
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "1.5px solid var(--sakura)",
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          />
                        )}
                        <div
                          style={{
                            padding: "8px 12px",
                            borderRadius: isBot ? "14px 14px 14px 2px" : "14px 14px 2px 14px",
                            background: isBot
                              ? "rgba(22, 8, 14, 0.88)"
                              : `linear-gradient(135deg, ${stance.secondary}, ${stance.primary})`,
                            border: isBot ? "1px solid var(--glass-border)" : "none",
                            color: isBot ? "var(--text)" : "#fff",
                            fontSize: "0.82rem",
                            lineHeight: 1.55,
                            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                            flex: 1,
                          }}
                        >
                          <ReactMarkdown>{msg.text}</ReactMarkdown>

                          {isBot && (
                            <div style={{ marginTop: 6, paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                              <span style={{ fontSize: "0.65rem" }}>{msg.time}</span>
                              <button
                                onClick={() => speakMessage(msg.text)}
                                style={{
                                  background: "rgba(255,183,197,0.1)",
                                  border: "1px solid var(--glass-border)",
                                  borderRadius: 6,
                                  padding: "2px 6px",
                                  color: "var(--sakura)",
                                  cursor: "pointer",
                                  fontSize: "0.68rem",
                                  fontWeight: 700,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 3,
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

                  {typingText && (
                    <div
                      style={{
                        alignSelf: "flex-start",
                        maxWidth: "92%",
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                      }}
                    >
                      <img
                        src={profilePhoto}
                        alt="Sujal AI"
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1.5px solid var(--sakura)",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: "14px 14px 14px 2px",
                          background: "rgba(22, 8, 14, 0.88)",
                          border: "1px solid var(--glass-border)",
                          color: "var(--text)",
                          fontSize: "0.82rem",
                          flex: 1,
                        }}
                      >
                        <ReactMarkdown>{typingText}</ReactMarkdown>
                        <span style={{ color: "var(--sakura)", animation: "pulse-dot 1s infinite" }}>▋</span>
                      </div>
                    </div>
                  )}

                  {loading && !typingText && (
                    <div
                      style={{
                        alignSelf: "flex-start",
                        padding: "6px 12px",
                        borderRadius: 14,
                        background: "rgba(22, 8, 14, 0.88)",
                        border: "1px solid var(--glass-border)",
                        fontSize: "0.75rem",
                        color: "var(--sakura)",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span>🌸 Contemplating wisdom...</span>
                    </div>
                  )}
                </>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Real-time Voice Recording Alert Banner */}
            <AnimatePresence>
              {listening && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: "7px 12px",
                    background: "linear-gradient(90deg, rgba(239,68,68,0.25), rgba(204,34,51,0.35))",
                    borderTop: "1px solid rgba(239,68,68,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.74rem",
                    color: "#fca5a5",
                    fontWeight: 600,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#ef4444",
                        boxShadow: "0 0 10px #ef4444",
                        animation: "pulse-dot 1s infinite",
                        display: "inline-block",
                      }}
                    />
                    <span>🎙️ <strong>Listening...</strong> Speak clearly, converting words live!</span>
                  </div>
                  <button
                    onClick={() => {
                      if (recognitionRef.current) {
                        try {
                          recognitionRef.current.stop();
                        } catch {}
                      }
                      setListening(false);
                    }}
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "none",
                      borderRadius: 4,
                      color: "#fff",
                      fontSize: "0.68rem",
                      padding: "2px 7px",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Box */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 12px",
                borderTop: listening ? "none" : "1px solid var(--glass-border)",
                background: "rgba(10, 3, 6, 0.95)",
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  listening
                    ? "🎙️ Listening... Speak now (converting words live)..."
                    : "Ask the Samurai Spirit..."
                }
                style={{
                  flex: 1,
                  background: listening ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.05)",
                  border: listening ? "1px solid rgba(239,68,68,0.6)" : "1px solid var(--glass-border)",
                  borderRadius: 10,
                  padding: "7px 10px",
                  color: "#fff",
                  fontSize: "0.82rem",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxShadow: listening ? "0 0 10px rgba(239,68,68,0.2)" : "none",
                }}
              />

              <button
                onClick={startListening}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: listening ? "#ef4444" : "rgba(255,255,255,0.06)",
                  border: listening ? "1px solid #f87171" : "1px solid var(--glass-border)",
                  color: listening ? "#ffffff" : "var(--sakura)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  boxShadow: listening ? "0 0 16px rgba(239,68,68,0.9)" : "none",
                  animation: listening ? "pulse-dot 1.2s infinite" : "none",
                  transition: "all 0.2s ease",
                }}
                title={listening ? "Recording... Click to stop" : "Speak to Samurai"}
              >
                <FaMicrophone />
              </button>

              <button
                onClick={handleSend}
                disabled={loading}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: `linear-gradient(135deg, ${stance.secondary}, ${stance.primary})`,
                  border: "none",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "0.8rem",
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
