import { useEffect, useRef, useState } from "react";
import {
  FaPaperPlane,
  FaTimes,
  FaMicrophone,
  FaStop,
  FaSpinner,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import API from "../services/api";
import { useStance } from "../context/StanceContext";
import { useBackendStatus } from "../context/BackendStatusContext";
import profilePhoto from "../assets/profile.png";

function ChatBot() {
  const { stance } = useStance();
  const { isOnline, isWaking, estimatedRemaining } = useBackendStatus();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [booting, setBooting] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [micStatusText, setMicStatusText] = useState("");
  const [micError, setMicError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const currentAudioRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordingTimerRef = useRef(null);

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

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
      if (streamRef.current) {
        try { streamRef.current.getTracks().forEach((t) => t.stop()); } catch {}
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
    };
  }, []);

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

  // ── Bulletproof Dual-Engine Voice Input (Web Speech API + MediaRecorder Groq Whisper) ──
  const cleanupRecording = () => {
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch {}
      streamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    setListening(false);
  };

  const transcribeAudioBlob = async (blob) => {
    if (!blob || blob.size < 120) {
      setTranscribing(false);
      setMicStatusText("");
      return;
    }

    setTranscribing(true);
    setMicStatusText("Transcribing voice...");

    try {
      const formData = new FormData();
      const ext = blob.type.includes("ogg") ? "ogg" : blob.type.includes("wav") ? "wav" : "webm";
      formData.append("audio", blob, `speech_${Date.now()}.${ext}`);

      const res = await API.post("transcribe/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 25000,
      });

      const text = res.data?.transcript || res.data?.text;
      if (text) {
        const clean = text.trim();
        if (clean) {
          setMessage((prev) => (prev.trim() ? `${prev.trim()} ${clean}` : clean));
        }
      }
    } catch (err) {
      console.warn("Whisper transcription error:", err);
      setMicError("Voice transcription service timed out. Please type your message.");
      setTimeout(() => setMicError(""), 4500);
    } finally {
      setTranscribing(false);
      setMicStatusText("");
    }
  };

  const stopListening = () => {
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn("MediaRecorder stop error:", err);
        cleanupRecording();
      }
    } else {
      cleanupRecording();
    }
  };

  const startListening = async () => {
    setMicError("");

    // If currently listening, toggle off to stop and transcribe
    if (listening) {
      stopListening();
      return;
    }

    // 1. Explicitly request microphone stream to guarantee browser permission dialog & device access
    let stream;
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia is not supported on this browser.");
      }
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
    } catch (err) {
      console.warn("Microphone access request failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicError("Microphone permission denied. Allow mic access in browser address bar.");
      } else {
        setMicError("No microphone found or audio capture is blocked on this device.");
      }
      setTimeout(() => setMicError(""), 5000);
      return;
    }

    // 2. Initialize MediaRecorder (Universal across Linux, Windows, macOS, Android, iOS)
    let mimeType = "";
    if (typeof MediaRecorder !== "undefined") {
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
        mimeType = "audio/ogg;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      }
    }

    audioChunksRef.current = [];
    let recorderStarted = false;

    if (typeof MediaRecorder !== "undefined") {
      try {
        const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mimeType || "audio/webm",
          });
          audioChunksRef.current = [];
          cleanupRecording();
          transcribeAudioBlob(audioBlob);
        };

        mediaRecorder.start(250);
        recorderStarted = true;
      } catch (e) {
        console.warn("Failed to create MediaRecorder:", e);
      }
    }

    setListening(true);
    setMicStatusText("Listening... (Click mic when done)");

    // 3. Optional: Live interim text preview using SpeechRecognition if available
    let hasWebSpeech = false;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.continuous = true;
        recognitionRef.current = recognition;

        recognition.onresult = (event) => {
          let liveTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            liveTranscript += event.results[i][0].transcript;
          }
          if (liveTranscript) {
            setMicStatusText(`Hearing: "${liveTranscript.slice(-32)}"`);
          }
        };

        recognition.onerror = (e) => {
          console.warn("Web Speech API notice (handled by Whisper backend):", e.error);
        };

        recognition.start();
        hasWebSpeech = true;
      } catch (err) {
        console.warn("SpeechRecognition start exception:", err);
      }
    }

    if (!recorderStarted && !hasWebSpeech) {
      cleanupRecording();
      setMicError("Speech audio capture is not supported on this browser.");
      return;
    }

    // 4. Auto-stop recording after 35 seconds to prevent runaway recording
    recordingTimerRef.current = setTimeout(() => {
      if (listening) {
        stopListening();
      }
    }, 35000);
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
      const errorReply = isWaking
        ? `⚡ The neural backend on Render is currently waking up from cold-start (~${estimatedRemaining}s). Please wait a moment and try your query again—it will connect automatically once online!`
        : "I was unable to communicate with the backend spirit realm. The cloud server may be spinning up; please try again in a few moments.";

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: errorReply,
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
                        background: isWaking ? "#f59e0b" : "#22c55e",
                        border: "1.5px solid #0e0408",
                        boxShadow: isWaking ? "0 0 6px #f59e0b" : "0 0 6px #22c55e",
                      }}
                      title={isWaking ? `Waking up cloud server (~${estimatedRemaining}s)` : "Online"}
                    />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                      Ronin Voice Guide · 浪人
                    </h3>
                    <p style={{ fontSize: "0.65rem", color: isWaking ? "#f59e0b" : "var(--sakura)", fontWeight: 600 }}>
                      {isWaking ? `⚡ Waking server (~${estimatedRemaining}s)...` : "Sujal's AI Spirit Guide • Online"}
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

            {/* Live Recording / Listening Indicator Banner */}
            <AnimatePresence>
              {(listening || transcribing) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: "7px 12px",
                    background: transcribing
                      ? "linear-gradient(90deg, rgba(234,179,8,0.25), rgba(245,158,11,0.35))"
                      : "linear-gradient(90deg, rgba(239,68,68,0.25), rgba(204,34,51,0.35))",
                    borderTop: transcribing
                      ? "1px solid rgba(234,179,8,0.5)"
                      : "1px solid rgba(239,68,68,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.74rem",
                    color: transcribing ? "#fde047" : "#fca5a5",
                    fontWeight: 600,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: transcribing ? "#eab308" : "#ef4444",
                        boxShadow: transcribing ? "0 0 10px #eab308" : "0 0 10px #ef4444",
                        animation: "pulse-dot 1s infinite",
                        display: "inline-block",
                      }}
                    />
                    <span>
                      {transcribing
                        ? "⚡ Neural Whisper transcribing your voice into text..."
                        : (micStatusText || "🎙️ Listening... Speak clearly, click Stop or Mic when done!")}
                    </span>
                  </div>
                  {listening && (
                    <button
                      onClick={stopListening}
                      style={{
                        background: "rgba(255,255,255,0.18)",
                        border: "none",
                        borderRadius: 4,
                        color: "#fff",
                        fontSize: "0.68rem",
                        padding: "2px 8px",
                        cursor: "pointer",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <FaStop size={8} /> Done
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Notification Banner */}
            <AnimatePresence>
              {micError && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{
                    padding: "6px 12px",
                    background: "rgba(239,68,68,0.25)",
                    borderTop: "1px solid rgba(239,68,68,0.5)",
                    color: "#fca5a5",
                    fontSize: "0.72rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>⚠️ {micError}</span>
                  <button
                    onClick={() => setMicError("")}
                    style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: "0.8rem", padding: "0 4px" }}
                  >
                    ✕
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
                borderTop: listening || transcribing ? "none" : "1px solid var(--glass-border)",
                background: "rgba(10, 3, 6, 0.95)",
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  transcribing
                    ? "⚡ Transcribing speech to text..."
                    : listening
                    ? "🎙️ Listening... Speak now (click mic when done)..."
                    : "Ask the Samurai Spirit..."
                }
                style={{
                  flex: 1,
                  background: listening ? "rgba(239,68,68,0.08)" : transcribing ? "rgba(234,179,8,0.08)" : "rgba(255,255,255,0.05)",
                  border: listening
                    ? "1px solid rgba(239,68,68,0.6)"
                    : transcribing
                    ? "1px solid rgba(234,179,8,0.6)"
                    : "1px solid var(--glass-border)",
                  borderRadius: 10,
                  padding: "7px 10px",
                  color: "#fff",
                  fontSize: "0.82rem",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxShadow: listening
                    ? "0 0 10px rgba(239,68,68,0.2)"
                    : transcribing
                    ? "0 0 10px rgba(234,179,8,0.2)"
                    : "none",
                }}
              />

              <button
                onClick={startListening}
                disabled={transcribing}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: transcribing
                    ? "rgba(234, 179, 8, 0.2)"
                    : listening
                    ? "#ef4444"
                    : "rgba(255,255,255,0.06)",
                  border: transcribing
                    ? "1px solid rgba(234, 179, 8, 0.6)"
                    : listening
                    ? "1px solid #f87171"
                    : "1px solid var(--glass-border)",
                  color: transcribing
                    ? "#eab308"
                    : listening
                    ? "#ffffff"
                    : "var(--sakura)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: transcribing ? "wait" : "pointer",
                  fontSize: "0.85rem",
                  boxShadow: listening
                    ? "0 0 16px rgba(239,68,68,0.9)"
                    : transcribing
                    ? "0 0 12px rgba(234, 179, 8, 0.5)"
                    : "none",
                  animation: listening ? "pulse-dot 1.2s infinite" : "none",
                  transition: "all 0.2s ease",
                }}
                title={
                  transcribing
                    ? "Transcribing voice with Whisper..."
                    : listening
                    ? "Recording... Click to stop speaking"
                    : "Speak to Samurai (Voice Dictation)"
                }
              >
                {transcribing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <FaSpinner />
                  </motion.div>
                ) : listening ? (
                  <FaStop />
                ) : (
                  <FaMicrophone />
                )}
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
