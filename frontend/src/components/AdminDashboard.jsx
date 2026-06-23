import { useEffect, useState } from "react";
import {
  FaProjectDiagram,
  FaUsers,
  FaDownload,
  FaRobot,
  FaComments,
} from "react-icons/fa";
import { motion } from "framer-motion";
import API from "../services/api";

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

function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("analytics/")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!data) {
    return (
      <section className="section">
        <div
          className="
            text-center
            text-cyan-400
            text-2xl
            animate-pulse
          "
        >
          Loading Analytics...
        </div>
      </section>
    );
  }

  const cards = [
    {
      title: "Projects",
      value: data.total_projects,
      icon: <FaProjectDiagram />,
      color: "cyan",
    },
    {
      title: "Visitors",
      value: data.total_visitors,
      icon: <FaUsers />,
      color: "pink",
    },
    {
      title: "Resume Downloads",
      value: data.total_resume_downloads,
      icon: <FaDownload />,
      color: "purple",
    },
    {
      title: "AI Sessions",
      value: data.total_chat_sessions,
      icon: <FaRobot />,
      color: "cyan",
    },
    {
      title: "AI Messages",
      value: data.total_chat_messages,
      icon: <FaComments />,
      color: "pink",
    },
  ];

  const glowBlur = IS_LOW ? 40 : IS_MEDIUM ? 80 : 140;
  const titleDuration = IS_LOW ? 0 : IS_MEDIUM ? 0.4 : 0.8;
  const cardDuration = IS_LOW ? 0 : IS_MEDIUM ? 0.3 : 0.6;
  const cardDelay = IS_LOW ? 0 : IS_MEDIUM ? 0.05 : 0.1;

  return (
    <section
      className="
        section
        relative
        overflow-hidden
      "
    >
      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute
          top-0
          left-0
          w-[400px]
          h-[400px]
          bg-cyan-500/10
          rounded-full
          -z-10
          pointer-events-none
        "
        style={{ filter: `blur(${glowBlur}px)` }}
      />

      <div
        className="
          absolute
          bottom-0
          right-0
          w-[400px]
          h-[400px]
          bg-pink-500/10
          rounded-full
          -z-10
          pointer-events-none
        "
        style={{ filter: `blur(${glowBlur}px)` }}
      />

      {/* TITLE */}
      {IS_LOW ? (
        <h2
          className="
            text-5xl
            font-black
            neonText
            mb-16
            text-center
          "
        >
          SYSTEM ANALYTICS
        </h2>
      ) : (
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: titleDuration }}
          className="
            text-5xl
            font-black
            neonText
            mb-16
            text-center
          "
        >
          SYSTEM ANALYTICS
        </motion.h2>
      )}

      {/* STAT CARDS */}
      <div
        className="
          grid
          md:grid-cols-3
          gap-10
        "
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={IS_LOW ? false : { opacity: 0, y: 40 }}
            whileInView={IS_LOW ? false : { opacity: 1, y: 0 }}
            transition={{
              duration: cardDuration,
              delay: index * cardDelay,
            }}
            whileHover={IS_LOW || IS_MEDIUM ? {} : { scale: 1.04 }}
            className="
              glass
              rounded-3xl
              p-8
              border
              border-cyan-500/10
              shadow-[0_0_35px_#00FFFF15]
              relative
              overflow-hidden
            "
          >
            {/* CARD GLOW */}
            <div
              className={`
                absolute
                inset-0
                opacity-10
                blur-3xl
                pointer-events-none
                ${
                  card.color === "cyan"
                    ? "bg-cyan-400"
                    : card.color === "pink"
                    ? "bg-pink-500"
                    : "bg-purple-500"
                }
              `}
            />

            <div className="relative z-10">
              <div
                className={`
                  text-5xl
                  mb-6
                  ${
                    card.color === "cyan"
                      ? "text-cyan-400"
                      : card.color === "pink"
                      ? "text-pink-500"
                      : "text-purple-500"
                  }
                `}
              >
                {card.icon}
              </div>

              <h3
                className="
                  text-2xl
                  font-bold
                  mb-4
                "
              >
                {card.title}
              </h3>

              <p
                className="
                  text-5xl
                  font-black
                  neonText
                "
              >
                {card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* RECENT VISITORS */}
      {IS_LOW ? (
        <div
          className="
            mt-20
            glass
            rounded-3xl
            p-10
            border
            border-cyan-500/10
          "
        >
          <h3
            className="
              text-3xl
              font-bold
              neonPink
              mb-8
            "
          >
            Recent Visitors
          </h3>

          <div className="space-y-5">
            {data.latest_visitors.map((visitor, index) => (
              <div
                key={index}
                className="
                  flex
                  justify-between
                  items-center
                  border-b
                  border-cyan-500/10
                  pb-4
                  text-gray-300
                "
              >
                <span>{visitor.ip_address}</span>
                <span>{new Date(visitor.visited_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: titleDuration }}
          className="
            mt-20
            glass
            rounded-3xl
            p-10
            border
            border-cyan-500/10
          "
        >
          <h3
            className="
              text-3xl
              font-bold
              neonPink
              mb-8
            "
          >
            Recent Visitors
          </h3>

          <div className="space-y-5">
            {data.latest_visitors.map((visitor, index) => (
              <div
                key={index}
                className="
                  flex
                  justify-between
                  items-center
                  border-b
                  border-cyan-500/10
                  pb-4
                  text-gray-300
                "
              >
                <span>{visitor.ip_address}</span>
                <span>{new Date(visitor.visited_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}

export default AdminDashboard;
