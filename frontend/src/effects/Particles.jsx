import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "@tsparticles/slim";

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

function ParticleEngine() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Low-end: skip particles entirely — render nothing
  if (IS_LOW) {
    return (
      <div
        className="fixed inset-0 -z-[15] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(0,255,255,0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(255,0,255,0.03) 0%, transparent 50%)",
        }}
      />
    );
  }

  // Medium: reduced particles, no interactivity, lower fps
  const options = {
    fullScreen: {
      enable: true,
      zIndex: -15,
    },
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: IS_MEDIUM ? 30 : 60,
    particles: {
      color: {
        value: ["#00FFFF", "#FF00FF", "#7F00FF"],
      },
      links: {
        enable: true,
        color: "#00FFFF",
        distance: IS_MEDIUM ? 100 : 140,
        opacity: IS_MEDIUM ? 0.1 : 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: IS_MEDIUM ? 0.8 : 1.5,
        direction: "none",
        outModes: {
          default: "bounce",
        },
      },
      number: {
        value: IS_MEDIUM ? 30 : 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: {
          min: 1,
          max: IS_MEDIUM ? 2 : 4,
        },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: !IS_MEDIUM, // disabled on medium
          mode: "grab",
        },
        onClick: {
          enable: !IS_MEDIUM, // disabled on medium
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 180,
          links: {
            opacity: 0.8,
          },
        },
        push: {
          quantity: 6,
        },
      },
    },
    detectRetina: !IS_MEDIUM, // disabled on medium
  };

  return <Particles id="tsparticles" init={particlesInit} options={options} />;
}

export default ParticleEngine;
