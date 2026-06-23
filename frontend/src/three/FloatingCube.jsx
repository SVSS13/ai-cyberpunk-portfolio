import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

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

function Box() {
  const mesh = useRef();

  // Low-end: skip useFrame
  if (!IS_LOW) {
    useFrame(() => {
      if (mesh.current) {
        mesh.current.rotation.x += 0.005;
        mesh.current.rotation.y += 0.005;
      }
    });
  }

  return (
    <mesh ref={mesh} rotation={IS_LOW ? [0.5, 0.5, 0] : [10, 10, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#00FFFF" />
    </mesh>
  );
}

function FloatingCube() {
  // Low-end: CSS fallback cube
  if (IS_LOW) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div
          className="w-32 h-32 bg-cyan-400 opacity-80"
          style={{
            transform: "rotateX(25deg) rotateY(25deg)",
            boxShadow: "0 0 40px rgba(0,255,255,0.3)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Canvas dpr={IS_MEDIUM ? 1 : [1, 2]}>
        <ambientLight intensity={2} />
        <directionalLight position={[2, 2, 2]} />
        <Box />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default FloatingCube;
