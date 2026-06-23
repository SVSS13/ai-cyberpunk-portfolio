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

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      {IS_LOW ? (
        <div className="text-cyan-400 text-2xl font-mono animate-pulse">
          Loading...
        </div>
      ) : (
        <div
          className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full"
          style={{
            animation: IS_MEDIUM
              ? "spin 1.5s linear infinite"
              : "spin 0.8s linear infinite",
          }}
        />
      )}
    </div>
  );
}

export default Loader;
