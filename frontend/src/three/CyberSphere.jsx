import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";

// ===== DEVICE DETECTION (inline) =====
const getDeviceTier = () => {
  if (typeof window === "undefined") return "high";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  if (cores <= 4 && memory <= 4) return "low";
  if (cores <= 6) return "medium";
  return "high";
};

const TIER = getDeviceTier();
const IS_LOW = TIER === "low";
const IS_MEDIUM = TIER === "medium";

function SphereMesh() {
  const mesh = useRef();

  // Low-end: skip useFrame (no animation loop)
  if (!IS_LOW) {
    useFrame(() => {
      if (mesh.current) {
        mesh.current.rotation.x += 0.002;
        mesh.current.rotation.y += 0.003;
      }
    });
  }

  // Adaptive geometry segments
  const segments = IS_LOW ? 16 : IS_MEDIUM ? 64 : 128;

  return (
    <Float
      speed={IS_LOW ? 0 : IS_MEDIUM ? 1.5 : 3}
      rotationIntensity={IS_LOW ? 0 : IS_MEDIUM ? 1 : 2}
      floatIntensity={IS_LOW ? 0 : IS_MEDIUM ? 1.5 : 3}
    >
      <mesh ref={mesh}>
        <sphereGeometry args={[2, segments, segments]} />
        {IS_LOW ? (
          <meshStandardMaterial color="#00FFFF" roughness={0.2} />
        ) : (
          <MeshDistortMaterial
            color="#00FFFF"
            attach="material"
            distort={IS_MEDIUM ? 0.2 : 0.45}
            speed={IS_MEDIUM ? 1.5 : 3}
            roughness={0}
          />
        )}
      </mesh>
    </Float>
  );
}

function CyberSphere() {
  // Low-end: CSS fallback (zero WebGL)
  if (IS_LOW) {
    return (
      <div className="absolute inset-0 -z-10 opacity-70 flex items-center justify-center bg-black">
        <div
          className="w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle at 30% 30%, #00FFFF, #001133)",
            boxShadow:
              "0 0 60px rgba(0,255,255,0.2), inset 0 0 40px rgba(0,255,255,0.1)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-10 opacity-70">
      <Canvas camera={{ position: [0, 0, 5] }} dpr={IS_MEDIUM ? 1 : [1, 2]}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 5]} />
        <SphereMesh />
      </Canvas>
    </div>
  );
}

export default CyberSphere;