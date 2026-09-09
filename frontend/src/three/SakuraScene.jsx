import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 1200;

// Japanese Momiji (Maple) & Sakura petal palettes
const PETAL_COLORS = [
  new THREE.Color('#FFB7C5'), // Sakura soft pink
  new THREE.Color('#FF8DA1'), // Sakura deep pink
  new THREE.Color('#FF5E7E'), // Rose blossom
  new THREE.Color('#D92038'), // Tsushima crimson maple
  new THREE.Color('#BA1325'), // Deep blood maple
  new THREE.Color('#E85D35'), // Sunset vermillion maple
  new THREE.Color('#FF7F50'), // Autumn coral
  new THREE.Color('#D4AF37'), // Samurai gold leaf
];

// Dual-geometry: Sakura petal curved leaf + Maple leaf outline
function createPetalGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.4);
  shape.bezierCurveTo(0.35, -0.2, 0.45, 0.3, 0, 0.55);
  shape.bezierCurveTo(-0.45, 0.3, -0.35, -0.2, 0, -0.4);
  const geo = new THREE.ShapeGeometry(shape, 8);
  // Add subtle 3D curvature along z
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, (Math.sin(x * 3.5) * 0.08) + (Math.cos(y * 3.0) * 0.05));
  }
  geo.computeVertexNormals();
  return geo;
}

function FallingPetals() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => createPetalGeometry(), []);

  // Petal physics state arrays
  const px = useMemo(() => new Float32Array(COUNT), []);
  const py = useMemo(() => new Float32Array(COUNT), []);
  const pz = useMemo(() => new Float32Array(COUNT), []);
  const vx = useMemo(() => new Float32Array(COUNT), []);
  const vy = useMemo(() => new Float32Array(COUNT), []);
  const vz = useMemo(() => new Float32Array(COUNT), []);
  const rx = useMemo(() => new Float32Array(COUNT), []);
  const ry = useMemo(() => new Float32Array(COUNT), []);
  const rz = useMemo(() => new Float32Array(COUNT), []);
  const rvx = useMemo(() => new Float32Array(COUNT), []);
  const rvy = useMemo(() => new Float32Array(COUNT), []);
  const rvz = useMemo(() => new Float32Array(COUNT), []);
  const scale = useMemo(() => new Float32Array(COUNT), []);
  const phase = useMemo(() => new Float32Array(COUNT), []);
  const freq = useMemo(() => new Float32Array(COUNT), []);
  const windAmp = useMemo(() => new Float32Array(COUNT), []);

  // Initialize petals
  useMemo(() => {
    for (let i = 0; i < COUNT; i++) {
      px[i] = (Math.random() - 0.5) * 38;
      py[i] = Math.random() * 26 - 6;
      pz[i] = (Math.random() - 0.5) * 16;
      vx[i] = (Math.random() - 0.5) * 0.005 - 0.004; // slight leftward autumn wind
      vy[i] = -(0.010 + Math.random() * 0.024);
      vz[i] = (Math.random() - 0.5) * 0.004;
      rx[i] = Math.random() * Math.PI * 2;
      ry[i] = Math.random() * Math.PI * 2;
      rz[i] = Math.random() * Math.PI * 2;
      rvx[i] = (Math.random() - 0.5) * 0.045;
      rvy[i] = (Math.random() - 0.5) * 0.035;
      rvz[i] = (Math.random() - 0.5) * 0.055;
      scale[i] = 0.07 + Math.random() * 0.14;
      phase[i] = Math.random() * Math.PI * 2;
      freq[i] = 0.2 + Math.random() * 0.6;
      windAmp[i] = 0.5 + Math.random() * 0.8;
    }
  }, [px, py, pz, vx, vy, vz, rx, ry, rz, rvx, rvy, rvz, scale, phase, freq, windAmp]);

  // Apply individual petal colors
  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < COUNT; i++) {
      const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      meshRef.current.setColorAt(i, color);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, []);

  // Mouse wind & parallax
  const mouseState = useRef({ x: 0, y: 0, vx: 0, vy: 0, lastX: 0, lastY: 0 });
  useEffect(() => {
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = -(e.clientY / window.innerHeight - 0.5) * 2;
      mouseState.current.vx = (nx - mouseState.current.lastX) * 1.5;
      mouseState.current.vy = (ny - mouseState.current.lastY) * 1.5;
      mouseState.current.lastX = nx;
      mouseState.current.lastY = ny;
      mouseState.current.x = nx;
      mouseState.current.y = ny;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime;
    const mesh = meshRef.current;
    if (!mesh) return;

    // Smooth camera mouse parallax
    const targetCamX = mouseState.current.x * 1.2;
    const targetCamY = mouseState.current.y * 0.8;
    camera.position.x += (targetCamX - camera.position.x) * 0.015;
    camera.position.y += (targetCamY - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);

    // Mouse velocity damping
    mouseState.current.vx *= 0.94;
    mouseState.current.vy *= 0.94;

    const mouseWorldX = mouseState.current.x * 10;
    const mouseWorldY = mouseState.current.y * 6;

    for (let i = 0; i < COUNT; i++) {
      // Atmospheric wind calculation
      const naturalWindX = Math.sin(t * freq[i] + phase[i]) * windAmp[i] * 0.012
                         + Math.cos(t * freq[i] * 0.4 + phase[i]) * 0.007 - 0.003;
      const flutterY = Math.sin(t * freq[i] * 1.8 + phase[i]) * 0.005;

      // Mouse interactive gust force
      const dx = px[i] - mouseWorldX;
      const dy = py[i] - mouseWorldY;
      const distSq = dx * dx + dy * dy;
      let mouseWindX = 0;
      let mouseWindY = 0;
      if (distSq < 25) {
        const force = (1 - Math.sqrt(distSq) / 5) * 0.06;
        mouseWindX = (dx / Math.sqrt(distSq + 0.1)) * force + mouseState.current.vx * 0.03;
        mouseWindY = (dy / Math.sqrt(distSq + 0.1)) * force + mouseState.current.vy * 0.03;
      }

      px[i] += vx[i] + naturalWindX + mouseWindX;
      py[i] += vy[i] + flutterY + mouseWindY;
      pz[i] += vz[i] + Math.sin(t * 0.3 + phase[i]) * 0.003;

      // Tumbling physics
      rx[i] += rvx[i] + Math.sin(t * 0.4 + phase[i]) * 0.003;
      ry[i] += rvy[i] + naturalWindX * 0.8;
      rz[i] += rvz[i] + Math.cos(t * 0.3 + phase[i]) * 0.002;

      // Reset petal on reaching bottom or boundary
      if (py[i] < -13 || px[i] < -22) {
        px[i] = 18 + Math.random() * 8;
        py[i] = 13 + Math.random() * 6;
        pz[i] = (Math.random() - 0.5) * 16;
        vy[i] = -(0.010 + Math.random() * 0.024);
        phase[i] = Math.random() * Math.PI * 2;
      }

      dummy.position.set(px[i], py[i], pz[i]);
      dummy.rotation.set(rx[i], ry[i], rz[i]);
      dummy.scale.setScalar(scale[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geo, undefined, COUNT]}>
      <meshStandardMaterial
        side={THREE.DoubleSide}
        transparent
        opacity={0.88}
        roughness={0.6}
        metalness={0.1}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// Glowing spider lily firefly motes
function SpiritMotes() {
  const ref = useRef();
  const N = 180;
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const c1 = new THREE.Color('#FFB7C5');
    const c2 = new THREE.Color('#D4AF37');
    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = Math.random() * 20 - 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      const c = Math.random() > 0.4 ? c1 : c2;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.008;
      ref.current.material.opacity = 0.45 + Math.sin(clock.elapsedTime * 1.2) * 0.25;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={N} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={N} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.07} vertexColors transparent opacity={0.6} depthWrite={false} sizeAttenuation />
    </points>
  );
}

export default function SakuraScene() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 65 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.8} color="#FF9988" />
        <directionalLight position={[6, 8, 5]} intensity={1.4} color="#FFE4D6" />
        <pointLight position={[-6, -4, 3]} intensity={1.2} color="#CC2233" />
        <pointLight position={[0, 4, 2]} intensity={0.9} color="#FFB7C5" />
        <FallingPetals />
        <SpiritMotes />
      </Canvas>
    </div>
  );
}
