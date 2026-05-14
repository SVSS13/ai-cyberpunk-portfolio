import { useEffect, useRef, useState } from "react";

import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaMicrophone,
  FaVolumeUp,
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

import ReactMarkdown from "react-markdown";

import API from "../services/api";

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
      text: "🚀 Welcome to Sujal's AI System.\n\nAsk me about projects, technologies, DevOps, AI, cloud systems or experience.",
      time: new Date().toLocaleTimeString(),
    },
  ]);

  const messagesEndRef = useRef(null);

  /* =========================
     BOOT SEQUENCE
  ========================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooting(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  /* =========================
     AUTO SCROLL
  ========================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
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
      const transcript = event.results[0][0].transcript;

      setMessage(transcript);

      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };
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

      const fullText = res.data.reply;

      let currentText = "";

      setTypingText("");

      for (let i = 0; i < fullText.length; i++) {
        currentText += fullText[i];

        setTypingText(currentText);

        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      const botMessage = {
        sender: "bot",

        text: fullText,

        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);

      setTypingText("");
    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,

        {
          sender: "bot",

          text: "⚠️ AI system temporarily unavailable.",

          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-6 z-50">
      {/* =========================
          TOGGLE BUTTON
      ========================= */}

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

      <AnimatePresence>
        {open &&
          (booting ? (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="
                mt-5
                w-[390px]
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
                <p>{">"} Initializing AI System...</p>

                <p>{">"} Connecting Neural Engine...</p>

                <p>{">"} Loading Portfolio Memory...</p>

                <p>{">"} Verifying GPT Interface...</p>

                <p>{">"} Recruiter Assistant Online ✅</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 40,
                scale: 0.9,
              }}
              transition={{
                duration: 0.35,
              }}
              className="
                mt-5
                w-[390px]
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
                    bg-cyan-400
                    text-black
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
                  <h2 className="font-bold text-xl neonText">
                    AI Recruiter Assistant
                  </h2>

                  <p className="text-sm text-gray-400">
                    GPT Powered Intelligence System
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
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
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
                          ? `
                            ml-auto
                            bg-cyan-400
                            text-black
                          `
                          : `
                            bg-[#111827]
                            border
                            border-cyan-500/10
                            text-gray-300
                          `
                      }
                    `}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>

                    <div
                      className="
                        flex
                        justify-between
                        items-center
                        mt-3
                        text-[10px]
                        opacity-70
                      "
                    >
                      <span>{msg.time}</span>

                      {msg.sender === "bot" && (
                        <button
                          onClick={() => speakMessage(msg.text)}
                          className="
                            hover:text-cyan-400
                            transition
                          "
                        >
                          <FaVolumeUp />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {typingText && (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
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
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
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
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />

                      <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce delay-100" />

                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-200" />
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask the AI assistant..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
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
                  "
                />

                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
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
                        ? `
                          bg-pink-500
                          text-white
                          shadow-[0_0_25px_#FF00FF]
                        `
                        : `
                          bg-[#111827]
                          text-cyan-400
                          border
                          border-cyan-500/20
                        `
                    }
                  `}
                >
                  <FaMicrophone />
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
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
                </motion.button>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

export default ChatBot;
