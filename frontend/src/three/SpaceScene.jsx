import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Galaxy() {
  const ref = useRef();
  const COUNT = 7000;
  const BRANCHES = 3;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const inside = new THREE.Color('#00d4ff');
    const outside = new THREE.Color('#9b59ff');
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const r = Math.random() * 7;
      const spin = r * 2.5;
      const branch = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const rx = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45;
      const ry = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.28;
      const rz = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45;
      positions[i3]     = Math.cos(branch + spin) * r + rx;
      positions[i3 + 1] = ry;
      positions[i3 + 2] = Math.sin(branch + spin) * r + rz;
      const c = new THREE.Color().lerpColors(inside, outside, r / 7);
      colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.045;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.018} sizeAttenuation vertexColors transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

function StarField() {
  const ref = useRef();
  const { positions } = useMemo(() => {
    const n = 1500;
    const positions = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return { positions };
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={1500} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#ffffff" transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

function Aurora({ idx }) {
  const ref = useRef();
  const PALETTE = ['#00d4ff', '#9b59ff', '#00ff88', '#ff3399', '#ffd700', '#00aaff'];

  const curve = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 18; i++) {
      const t = i / 17;
      pts.push(new THREE.Vector3(
        (t - 0.5) * 28,
        Math.sin(t * Math.PI * 2 + idx * 1.6) * (1.2 + idx * 0.4),
        -4 - idx * 1.8 + Math.cos(t * Math.PI * 1.5 + idx) * 0.9
      ));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, [idx]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity = 0.22 + Math.sin(clock.elapsedTime * 0.55 + idx * 0.8) * 0.18;
    }
  });

  return (
    <mesh ref={ref}>
      <tubeGeometry args={[curve, 80, 0.016 + idx * 0.003, 6, false]} />
      <meshBasicMaterial color={PALETTE[idx % PALETTE.length]} transparent opacity={0.3} depthWrite={false} />
    </mesh>
  );
}

function Nebula({ position, color, scale }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity = 0.04 + Math.sin(clock.elapsedTime * 0.25 + position[0]) * 0.015;
    }
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef([0, 0]);
  useEffect(() => {
    const h = (e) => {
      mouse.current = [
        (e.clientX / window.innerWidth  - 0.5) * 1.4,
        -(e.clientY / window.innerHeight - 0.5) * 0.9,
      ];
    };
    window.addEventListener('mousemove', h, { passive: true });
    return () => window.removeEventListener('mousemove', h);
  }, []);
  useFrame(() => {
    camera.position.x += (mouse.current[0] - camera.position.x) * 0.014;
    camera.position.y += (mouse.current[1] - camera.position.y) * 0.014;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function SpaceScene() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 70 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <StarField />
        <Galaxy />
        {[0,1,2,3,4,5].map(i => <Aurora key={i} idx={i} />)}
        <Nebula position={[-3, 2, -7]} color="#9b59ff" scale={[3, 2, 2]} />
        <Nebula position={[4, -1, -9]} color="#00d4ff" scale={[4, 3, 3]} />
        <Nebula position={[0, -4, -6]} color="#ff3399" scale={[2.5, 2, 2]} />
        <CameraRig />
      </Canvas>
    </div>
  );
}
