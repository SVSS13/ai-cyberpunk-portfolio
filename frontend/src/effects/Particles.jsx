import { useCallback } from "react";

import Particles from "react-tsparticles";

import { loadSlim } from "@tsparticles/slim";

function ParticleEngine() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -15,
        },

        background: {
          color: {
            value: "transparent",
          },
        },

        fpsLimit: 60,

        particles: {
          color: {
            value: ["#00FFFF", "#FF00FF", "#7F00FF"],
          },

          links: {
            enable: true,
            color: "#00FFFF",
            distance: 140,
            opacity: 0.2,
            width: 1,
          },

          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            outModes: {
              default: "bounce",
            },
          },

          number: {
            value: 80,
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
              max: 4,
            },
          },
        },

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },

            onClick: {
              enable: true,
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

        detectRetina: true,
      }}
    />
  );
}

export default ParticleEngine;
