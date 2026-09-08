import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// ===== DEVICE DETECTION =====
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

/* =========================
   ATMOSPHERE SHADER
========================= */
function Atmosphere() {
  const meshRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#00ffff") },
    }),
    []
  );

  if (!IS_LOW) {
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
      }
    });
  }

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
      vec3 glow = uColor * intensity * 1.5;
      float pulse = sin(uTime * 0.5) * 0.1 + 0.9;
      gl_FragColor = vec4(glow * pulse, intensity * 0.6);
    }
  `;

  return (
    <mesh ref={meshRef} scale={1.4}>
      <sphereGeometry args={[2, IS_MEDIUM ? 32 : 64, IS_MEDIUM ? 32 : 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* =========================
   PLANET SURFACE
========================= */
function PlanetSurface() {
  const meshRef = useRef();

  if (!IS_LOW) {
    useFrame(() => {
      if (meshRef.current) {
        meshRef.current.rotation.y += IS_MEDIUM ? 0.001 : 0.002;
      }
    });
  }

  // Create planet texture procedurally
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Base dark blue
    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, 0, 512, 512);

    // Add noise/continents
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 10 + Math.random() * 40;
      const colors = ["#1a3a5c", "#0d2137", "#1e4d6b", "#152a3d"];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.globalAlpha = 0.3 + Math.random() * 0.4;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add cyan tech lines
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 512, Math.random() * 512);
      ctx.lineTo(Math.random() * 512, Math.random() * 512);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  const segments = IS_LOW ? 16 : IS_MEDIUM ? 32 : 64;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, segments, segments]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.8}
        metalness={0.2}
        emissive="#001133"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

/* =========================
   ORBIT RING
========================= */
function OrbitRing({ radius = 3.5, tilt = 75, color = "#00ffff", speed = 1 }) {
  const ringRef = useRef();

  if (!IS_LOW) {
    useFrame((state) => {
      if (ringRef.current) {
        ringRef.current.rotation.z = state.clock.elapsedTime * speed * 0.1;
      }
    });
  }

  return (
    <mesh ref={ringRef} rotation={[THREE.MathUtils.degToRad(tilt), 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, IS_MEDIUM ? 64 : 128]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* =========================
   MOON
========================= */
function Moon() {
  const moonRef = useRef();
  const groupRef = useRef();

  if (!IS_LOW) {
    useFrame((state) => {
      if (groupRef.current) {
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      }
    });
  }

  return (
    <group ref={groupRef}>
      <mesh ref={moonRef} position={[3.5, 0, 0]}>
        <sphereGeometry args={[0.3, IS_MEDIUM ? 16 : 32, IS_MEDIUM ? 16 : 32]} />
        <meshStandardMaterial
          color="#c0c0c0"
          roughness={0.9}
          emissive="#222"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

/* =========================
   PARTICLE CLOUD
========================= */
function ParticleCloud() {
  const particlesRef = useRef();

  const particles = useMemo(() => {
    const count = IS_MEDIUM ? 200 : 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  if (!IS_LOW) {
    useFrame((state) => {
      if (particlesRef.current) {
        particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      }
    });
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00ffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/* =========================
   MAIN PLANET HERO
========================= */
function PlanetHero() {
  // Low-end: CSS fallback
  if (IS_LOW) {
    return (
      <div className="planet-container">
        <div className="planet-atmosphere" />
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle at 30% 30%, #1a3a5c, #0a1628)",
            boxShadow: "0 0 60px rgba(0,255,255,0.2), inset 0 0 40px rgba(0,255,255,0.1)",
          }}
        />
        <div className="planet-ring" />
        <div className="planet-moon" />
      </div>
    );
  }

  return (
    <div className="planet-container" style={{ width: 300, height: 300 }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={IS_MEDIUM ? 1 : [1, 2]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#ff00ff" />

        <PlanetSurface />
        <Atmosphere />
        <OrbitRing radius={3.2} tilt={70} color="#00ffff" speed={1} />
        <OrbitRing radius={3.8} tilt={65} color="#ff00ff" speed={-0.7} />
        <Moon />
        <ParticleCloud />
      </Canvas>
    </div>
  );
}

export default PlanetHero;
