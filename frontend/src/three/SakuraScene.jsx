import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStance } from '../context/StanceContext';

const PETAL_COUNT = 1300;
const EMBER_COUNT = 180;

// ── 1. Curved Organic Petal Geometry ──
function createPetalGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.4);
  shape.bezierCurveTo(0.35, -0.2, 0.45, 0.3, 0, 0.55);
  shape.bezierCurveTo(-0.45, 0.3, -0.35, -0.2, 0, -0.4);
  const geo = new THREE.ShapeGeometry(shape, 8);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, (Math.sin(x * 3.5) * 0.08) + (Math.cos(y * 3.0) * 0.05));
  }
  geo.computeVertexNormals();
  return geo;
}

// ── 2. Dynamic Stance-Reactive Petals & Leaves ──
function FallingPetals() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => createPetalGeometry(), []);
  const { stance } = useStance();

  const px = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const py = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const pz = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const vx = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const vy = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const vz = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const rx = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const ry = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const rz = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const rvx = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const rvy = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const rvz = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const scale = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const phase = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const freq = useMemo(() => new Float32Array(PETAL_COUNT), []);
  const windAmp = useMemo(() => new Float32Array(PETAL_COUNT), []);

  useMemo(() => {
    for (let i = 0; i < PETAL_COUNT; i++) {
      px[i] = (Math.random() - 0.5) * 40;
      py[i] = Math.random() * 28 - 7;
      pz[i] = (Math.random() - 0.5) * 16;
      vx[i] = (Math.random() - 0.5) * 0.006 - 0.005;
      vy[i] = -(0.010 + Math.random() * 0.025);
      vz[i] = (Math.random() - 0.5) * 0.004;
      rx[i] = Math.random() * Math.PI * 2;
      ry[i] = Math.random() * Math.PI * 2;
      rz[i] = Math.random() * Math.PI * 2;
      rvx[i] = (Math.random() - 0.5) * 0.045;
      rvy[i] = (Math.random() - 0.5) * 0.035;
      rvz[i] = (Math.random() - 0.5) * 0.055;
      scale[i] = 0.065 + Math.random() * 0.14;
      phase[i] = Math.random() * Math.PI * 2;
      freq[i] = 0.2 + Math.random() * 0.6;
      windAmp[i] = 0.5 + Math.random() * 0.8;
    }
  }, [px, py, pz, vx, vy, vz, rx, ry, rz, rvx, rvy, rvz, scale, phase, freq, windAmp]);

  // Update petal colors dynamically when stance changes
  useEffect(() => {
    if (!meshRef.current) return;
    const colors = stance.particleColors.map(hex => new THREE.Color(hex));
    for (let i = 0; i < PETAL_COUNT; i++) {
      const color = colors[i % colors.length];
      meshRef.current.setColorAt(i, color);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [stance]);

  // Mouse wind interaction
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

    // Subtle camera parallax follow
    const targetCamX = mouseState.current.x * 1.1;
    const targetCamY = mouseState.current.y * 0.7;
    camera.position.x += (targetCamX - camera.position.x) * 0.015;
    camera.position.y += (targetCamY - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);

    mouseState.current.vx *= 0.94;
    mouseState.current.vy *= 0.94;

    const mouseWorldX = mouseState.current.x * 10;
    const mouseWorldY = mouseState.current.y * 6;

    for (let i = 0; i < PETAL_COUNT; i++) {
      const naturalWindX = Math.sin(t * freq[i] + phase[i]) * windAmp[i] * 0.014
                         + Math.cos(t * freq[i] * 0.4 + phase[i]) * 0.008 - 0.004;
      const flutterY = Math.sin(t * freq[i] * 1.8 + phase[i]) * 0.006;

      // Mouse distance force
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

      rx[i] += rvx[i] + Math.sin(t * 0.4 + phase[i]) * 0.003;
      ry[i] += rvy[i] + naturalWindX * 0.8;
      rz[i] += rvz[i] + Math.cos(t * 0.3 + phase[i]) * 0.002;

      // Wrap around boundary
      if (py[i] < -14 || px[i] < -24) {
        px[i] = 20 + Math.random() * 8;
        py[i] = 14 + Math.random() * 6;
        pz[i] = (Math.random() - 0.5) * 16;
        vy[i] = -(0.010 + Math.random() * 0.025);
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
    <instancedMesh ref={meshRef} args={[geo, undefined, PETAL_COUNT]}>
      <meshStandardMaterial
        side={THREE.DoubleSide}
        transparent
        opacity={0.88}
        roughness={0.55}
        metalness={0.12}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ── 3. Tsushima Glowing Spirit Embers / Spores ──
function SpiritEmbers() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => new THREE.SphereGeometry(0.04, 6, 6), []);
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
      evy[i] = 0.008 + Math.random() * 0.018; // Float gently upward
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

      const pulse = 0.8 + Math.sin(t * 3 + ephase[i]) * 0.35;
      dummy.position.set(ex[i], ey[i], ez[i]);
      dummy.scale.setScalar(pulse);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geo, undefined, EMBER_COUNT]}>
      <meshBasicMaterial transparent opacity={0.7} />
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
      <group ref={lineRef1} position={[-20, 1.5, -5]}>
        <mesh rotation={[0, 0, -0.08]}>
          <planeGeometry args={[16, 0.04]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.22} />
        </mesh>
        <mesh position={[2, -0.4, 0.5]} rotation={[0, 0, -0.12]}>
          <planeGeometry args={[12, 0.03]} />
          <meshBasicMaterial color={stance.primary} transparent opacity={0.28} />
        </mesh>
      </group>

      <group ref={lineRef2} position={[-20, -2.2, -3]}>
        <mesh rotation={[0, 0, -0.06]}>
          <planeGeometry args={[14, 0.035]} />
          <meshBasicMaterial color={stance.secondary} transparent opacity={0.2} />
        </mesh>
      </group>
    </>
  );
}

// ── 5. Main Canvas Scene ──
export default function SakuraScene() {
  const { stance } = useStance();

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 65 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.75} color={stance.primary} />
        <directionalLight position={[6, 8, 5]} intensity={1.4} color="#FFE4D6" />
        <pointLight position={[-6, -4, 3]} intensity={1.3} color={stance.secondary} />
        <pointLight position={[6, 4, 2]} intensity={1.1} color={stance.primary} />

        {/* ── 1300 Stance-Reactive Dynamic Petals/Leaves ── */}
        <FallingPetals />

        {/* ── Floating Tsushima Spirit Embers/Spores ── */}
        <SpiritEmbers />

        {/* ── Guiding Wind Ribbons ── */}
        <GuidingWind />
      </Canvas>
    </div>
  );
}
