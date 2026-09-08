import { useState } from "react";
import { motion } from "framer-motion";

const analyticsData = [
  { label: "Projects", value: "4+", icon: "📁", color: "cyan" },
  { label: "Visitors", value: "1.2K", icon: "👥", color: "pink" },
  { label: "Downloads", value: "89", icon: "⬇", color: "purple" },
  { label: "AI Sessions", value: "234", icon: "🤖", color: "green" },
  { label: "Messages", value: "1.5K", icon: "💬", color: "yellow" },
];

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
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-20 right-5 z-40 w-10 h-10 rounded-full bg-[#111827] border border-purple-500/30 flex items-center justify-center text-purple-400 hover:shadow-[0_0_15px_rgba(127,0,255,0.3)] transition-all duration-300"
        title="Analytics Dashboard"
      >
        📊
      </button>

      {/* Dashboard Panel */}
      {isVisible && (
        <motion.div
          initial={IS_LOW ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-32 right-5 z-40 w-[300px] bg-[#0a0a0f] border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(127,0,255,0.15)]"
        >
          <h3 className="text-lg font-bold text-purple-400 mb-4">
            System Analytics
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {analyticsData.map((item, index) => (
              <motion.div
                key={index}
                initial={IS_LOW ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-4 text-center"
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xl font-bold text-cyan-400">
                  {item.value}
                </div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="w-full mt-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-colors"
          >
            Close Dashboard
          </button>
        </motion.div>
      )}
    </>
  );
}

export default AdminDashboard;
