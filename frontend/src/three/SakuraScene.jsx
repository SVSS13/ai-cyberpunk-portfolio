import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStance } from '../context/StanceContext';

const TOTAL_LEAVES = 950;
const EMBER_COUNT = 150;

// ── 1. Authentic 5-Point Japanese Autumn Maple Leaf (Momiji) Geometry ──
function createMapleLeafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.45);
  shape.lineTo(0.06, -0.12);
  shape.lineTo(0.26, -0.28);
  shape.lineTo(0.38, 0.06);
  shape.lineTo(0.18, 0.16);
  shape.lineTo(0.30, 0.44);
  shape.lineTo(0.08, 0.32);
  shape.lineTo(0, 0.58); // Center Top Lobe
  shape.lineTo(-0.08, 0.32);
  shape.lineTo(-0.30, 0.44);
  shape.lineTo(-0.18, 0.16);
  shape.lineTo(-0.38, 0.06);
  shape.lineTo(-0.26, -0.28);
  shape.lineTo(-0.06, -0.12);
  shape.closePath();

  const geo = new THREE.ShapeGeometry(shape, 8);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // 3D aerodynamic cupping
    pos.setZ(i, (Math.sin(x * 4.2) * 0.06) + (Math.cos(y * 3.6) * 0.045));
  }
  geo.computeVertexNormals();
  return geo;
}

// ── 2. 3D Swirling Japanese Autumn Maple Leaves ──
function SwirlingMomijiLeaves() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => createMapleLeafGeometry(), []);
  const { stance } = useStance();

  const px = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const py = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const pz = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const vx = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const vy = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const vz = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const rx = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const ry = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const rz = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const rvx = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const rvy = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const rvz = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const scale = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const phase = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const freq = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const windAmp = useMemo(() => new Float32Array(TOTAL_LEAVES), []);

  useMemo(() => {
    for (let i = 0; i < TOTAL_LEAVES; i++) {
      px[i] = (Math.random() - 0.5) * 40;
      py[i] = Math.random() * 28 - 7;
      pz[i] = (Math.random() - 0.5) * 14;
      vx[i] = -(0.010 + Math.random() * 0.022); // Wind drifts leftward
      vy[i] = -(0.012 + Math.random() * 0.024);
      vz[i] = (Math.random() - 0.5) * 0.006;
      rx[i] = Math.random() * Math.PI * 2;
      ry[i] = Math.random() * Math.PI * 2;
      rz[i] = Math.random() * Math.PI * 2;
      rvx[i] = (Math.random() - 0.5) * 0.05;
      rvy[i] = (Math.random() - 0.5) * 0.04;
      rvz[i] = (Math.random() - 0.5) * 0.06;
      scale[i] = 0.075 + Math.random() * 0.16;
      phase[i] = Math.random() * Math.PI * 2;
      freq[i] = 0.35 + Math.random() * 0.75;
      windAmp[i] = 0.6 + Math.random() * 0.9;
    }
  }, [px, py, pz, vx, vy, vz, rx, ry, rz, rvx, rvy, rvz, scale, phase, freq, windAmp]);

  // Update leaf colors dynamically with stance
  useEffect(() => {
    if (!meshRef.current) return;
    const colors = stance.particleColors.map(hex => new THREE.Color(hex));
    for (let i = 0; i < TOTAL_LEAVES; i++) {
      const color = colors[i % colors.length];
      meshRef.current.setColorAt(i, color);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [stance]);

  // Interactive mouse wind physics
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

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const mesh = meshRef.current;
    if (!mesh) return;

    mouseState.current.vx *= 0.94;
    mouseState.current.vy *= 0.94;

    const mouseWorldX = mouseState.current.x * 10;
    const mouseWorldY = mouseState.current.y * 6;

    for (let i = 0; i < TOTAL_LEAVES; i++) {
      const gustX = Math.sin(t * freq[i] + phase[i]) * windAmp[i] * 0.014
                  + Math.cos(t * freq[i] * 0.5 + phase[i]) * 0.008;
      const flutterY = Math.cos(t * freq[i] * 2.0 + phase[i]) * 0.007;

      const dx = px[i] - mouseWorldX;
      const dy = py[i] - mouseWorldY;
      const distSq = dx * dx + dy * dy;
      let mouseWindX = 0;
      let mouseWindY = 0;
      if (distSq < 24) {
        const force = (1 - Math.sqrt(distSq) / 4.9) * 0.07;
        mouseWindX = (dx / Math.sqrt(distSq + 0.1)) * force + mouseState.current.vx * 0.035;
        mouseWindY = (dy / Math.sqrt(distSq + 0.1)) * force + mouseState.current.vy * 0.035;
      }

      px[i] += vx[i] + gustX + mouseWindX;
      py[i] += vy[i] + flutterY + mouseWindY;
      pz[i] += vz[i] + Math.sin(t * 0.35 + phase[i]) * 0.002;

      rx[i] += rvx[i] + Math.sin(t * 0.5 + phase[i]) * 0.004;
      ry[i] += rvy[i] + gustX * 0.8;
      rz[i] += rvz[i] + Math.cos(t * 0.35 + phase[i]) * 0.004;

      if (py[i] < -14 || px[i] < -24) {
        px[i] = 20 + Math.random() * 8;
        py[i] = 14 + Math.random() * 6;
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
    <instancedMesh ref={meshRef} args={[geo, undefined, TOTAL_LEAVES]}>
      <meshStandardMaterial
        side={THREE.DoubleSide}
        transparent
        opacity={0.92}
        roughness={0.45}
        metalness={0.15}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ── 3. Glowing Spirit Embers ──
function SpiritEmbers() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => new THREE.SphereGeometry(0.045, 6, 6), []);
  const { stance } = useStance();

  const ex = useMemo(() => new Float32Array(EMBER_COUNT), []);
  const ey = useMemo(() => new Float32Array(EMBER_COUNT), []);
  const ez = useMemo(() => new Float32Array(EMBER_COUNT), []);
  const evy = useMemo(() => new Float32Array(EMBER_COUNT), []);
  const ephase = useMemo(() => new Float32Array(EMBER_COUNT), []);
  const efreq = useMemo(() => new Float32Array(EMBER_COUNT), []);

  useMemo(() => {
    for (let i = 0; i < EMBER_COUNT; i++) {
      ex[i] = (Math.random() - 0.5) * 36;
      ey[i] = (Math.random() - 0.5) * 20;
      ez[i] = (Math.random() - 0.5) * 12;
      evy[i] = 0.009 + Math.random() * 0.02;
      ephase[i] = Math.random() * Math.PI * 2;
      efreq[i] = 0.5 + Math.random() * 1.2;
    }
  }, [ex, ey, ez, evy, ephase, efreq]);

  useEffect(() => {
    if (!meshRef.current) return;
    const emberCol = new THREE.Color(stance.primary);
    for (let i = 0; i < EMBER_COUNT; i++) {
      meshRef.current.setColorAt(i, emberCol);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [stance]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < EMBER_COUNT; i++) {
      ey[i] += evy[i];
      const driftX = Math.sin(t * efreq[i] + ephase[i]) * 0.012;
      ex[i] += driftX;

      if (ey[i] > 12) {
        ey[i] = -12;
        ex[i] = (Math.random() - 0.5) * 36;
      }

      const pulse = 0.8 + Math.sin(t * 3.2 + ephase[i]) * 0.35;
      dummy.position.set(ex[i], ey[i], ez[i]);
      dummy.scale.setScalar(pulse);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geo, undefined, EMBER_COUNT]}>
      <meshBasicMaterial transparent opacity={0.75} />
    </instancedMesh>
  );
}

// ── 4. Guiding Wind Gust Ribbons ──
function GuidingWind() {
  const lineRef1 = useRef();
  const lineRef2 = useRef();
  const { stance } = useStance();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (lineRef1.current) {
      lineRef1.current.rotation.z = Math.sin(t * 0.35) * 0.08 - 0.04;
      lineRef1.current.position.x = ((t * 7) % 44) - 22;
      lineRef1.current.position.y = 1.5 + Math.sin(t * 0.5) * 0.4;
    }
    if (lineRef2.current) {
      lineRef2.current.rotation.z = Math.cos(t * 0.4) * 0.06 - 0.02;
      lineRef2.current.position.x = (((t + 3) * 9) % 46) - 23;
      lineRef2.current.position.y = -2.2 + Math.cos(t * 0.6) * 0.5;
    }
  });

  return (
    <>
      <group ref={lineRef1} position={[-20, 1.5, -2]}>
        <mesh rotation={[0, 0, -0.08]}>
          <planeGeometry args={[16, 0.04]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.2} />
        </mesh>
        <mesh position={[2, -0.4, 0.5]} rotation={[0, 0, -0.12]}>
          <planeGeometry args={[12, 0.03]} />
          <meshBasicMaterial color={stance.primary} transparent opacity={0.28} />
        </mesh>
      </group>

      <group ref={lineRef2} position={[-20, -2.2, -1.5]}>
        <mesh rotation={[0, 0, -0.06]}>
          <planeGeometry args={[14, 0.035]} />
          <meshBasicMaterial color={stance.secondary} transparent opacity={0.2} />
        </mesh>
      </group>
    </>
  );
}

// ── 5. Camera Parallax ──
function CameraParallax() {
  const mouseState = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouseState.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseState.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ camera }) => {
    const targetX = mouseState.current.x * 0.6;
    const targetY = mouseState.current.y * 0.4;
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── 6. Main WebGL Scene ──
export default function SakuraScene() {
  const { stance } = useStance();

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 65 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.7} color={stance.primary} />
        <directionalLight position={[6, 8, 5]} intensity={1.3} color="#FFE4D6" />
        <pointLight position={[-6, -4, 3]} intensity={1.2} color={stance.secondary} />
        <pointLight position={[6, 4, 2]} intensity={1.0} color={stance.primary} />

        {/* ── 1. Smooth 3D Perspective Parallax ── */}
        <CameraParallax />

        {/* ── 2. 950 3D Swirling Japanese Autumn Maple Leaves ── */}
        <SwirlingMomijiLeaves />

        {/* ── 3. Glowing Spirit Embers ── */}
        <SpiritEmbers />

        {/* ── 4. Guiding Wind Gusts ── */}
        <GuidingWind />
      </Canvas>
    </div>
  );
}
