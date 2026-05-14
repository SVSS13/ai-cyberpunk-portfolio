import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Box() {
  return (
    <mesh rotation={[10, 10, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#00FFFF" />
    </mesh>
  );
}

function FloatingCube() {
  return (
    <div className="h-screen">
      <Canvas>
        <ambientLight intensity={2} />

        <directionalLight position={[2, 2, 2]} />

        <Box />

        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default FloatingCube;
