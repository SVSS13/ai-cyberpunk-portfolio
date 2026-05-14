import { Canvas, useFrame } from "@react-three/fiber";

import { Float, MeshDistortMaterial } from "@react-three/drei";

import { useRef } from "react";

function SphereMesh() {
  const mesh = useRef();

  useFrame(() => {
    mesh.current.rotation.x += 0.002;

    mesh.current.rotation.y += 0.003;
  });

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={3}>
      <mesh ref={mesh}>
        <sphereGeometry args={[2, 128, 128]} />

        <MeshDistortMaterial
          color="#00FFFF"
          attach="material"
          distort={0.45}
          speed={3}
          roughness={0}
        />
      </mesh>
    </Float>
  );
}

function CyberSphere() {
  return (
    <div
      className="
        absolute
        inset-0
        -z-10
        opacity-70
      "
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />

        <directionalLight position={[2, 2, 5]} />

        <SphereMesh />
      </Canvas>
    </div>
  );
}

export default CyberSphere;
