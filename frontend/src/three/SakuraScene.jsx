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
    pos.setZ(i, (Math.sin(x * 4.2) * 0.06) + (Math.cos(y * 3.6) * 0.045));
  }
  geo.computeVertexNormals();
  return geo;
}

// ── 2. Dynamic Stance-Reactive 3D Momiji Particle Physics ──
function DynamicStanceMomiji() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => createMapleLeafGeometry(), []);
  const { stance, stanceId } = useStance();

  const px = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const py = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
  const pz = useMemo(() => new Float32Array(TOTAL_LEAVES), []);
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
      py[i] = (Math.random() - 0.5) * 26;
      pz[i] = (Math.random() - 0.5) * 14;
      rx[i] = Math.random() * Math.PI * 2;
      ry[i] = Math.random() * Math.PI * 2;
      rz[i] = Math.random() * Math.PI * 2;
      rvx[i] = (Math.random() - 0.5) * 0.05;
      rvy[i] = (Math.random() - 0.5) * 0.04;
      rvz[i] = (Math.random() - 0.5) * 0.06;
      scale[i] = 0.075 + Math.random() * 0.16;
      phase[i] = Math.random() * Math.PI * 2;
      freq[i] = 0.4 + Math.random() * 0.8;
      windAmp[i] = 0.7 + Math.random() * 0.8;
    }
  }, [px, py, pz, rx, ry, rz, rvx, rvy, rvz, scale, phase, freq, windAmp]);

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

  // Current lerped physics values for smooth transitions
  const currentPhysics = useRef({
    windSpeedX: -0.010,
    fallSpeedY: -0.020,
    waveFreq: 1.5,
    waveAmp: 0.010,
    flutterAmp: 0.008,
    tumbleSpeed: 1.0,
    mouseForce: 0.08,
  });

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

    // Smoothly transition physics properties when stance changes
    const target = stance.physics;
    const cp = currentPhysics.current;
    cp.windSpeedX += (target.windSpeedX - cp.windSpeedX) * 0.05;
    cp.fallSpeedY += (target.fallSpeedY - cp.fallSpeedY) * 0.05;
    cp.waveFreq += (target.waveFreq - cp.waveFreq) * 0.05;
    cp.waveAmp += (target.waveAmp - cp.waveAmp) * 0.05;
    cp.flutterAmp += (target.flutterAmp - cp.flutterAmp) * 0.05;
    cp.tumbleSpeed += (target.tumbleSpeed - cp.tumbleSpeed) * 0.05;
    cp.mouseForce += (target.mouseForce - cp.mouseForce) * 0.05;

    mouseState.current.vx *= 0.94;
    mouseState.current.vy *= 0.94;

    const mouseWorldX = mouseState.current.x * 10;
    const mouseWorldY = mouseState.current.y * 6;

    for (let i = 0; i < TOTAL_LEAVES; i++) {
      let customMoveX = cp.windSpeedX;
      let customMoveY = cp.fallSpeedY;

      // ── Stance-Specific Physics Profiles ──
      if (stanceId === 'water') {
        // Tsunami / Tidal Swells: Flowing undulating sine wave surging up & down
        const wave = Math.sin(t * cp.waveFreq + px[i] * 0.4 + phase[i]) * cp.waveAmp;
        const waveSecondary = Math.cos(t * 1.2 + pz[i] * 0.3) * 0.008;
        customMoveY += wave + waveSecondary;
        customMoveX += Math.cos(t * cp.waveFreq * 0.6 + phase[i]) * 0.006;
      } else if (stanceId === 'wind') {
        // Toofan / Typhoon: Extreme turbulent lateral gusts & whipping vortexes
        const toofanGust = Math.sin(t * cp.waveFreq * freq[i] + phase[i]) * cp.waveAmp * windAmp[i];
        const toofanLift = Math.sin(t * 5.0 + px[i] * 0.8) * cp.flutterAmp;
        customMoveX += toofanGust * 1.6;
        customMoveY += toofanLift;
      } else if (stanceId === 'moon') {
        // Anti-Gravity / Lunar Hover: Weightless orbital float & gentle hover
        const lunarHoverX = Math.sin(t * 0.6 + phase[i]) * 0.008;
        const lunarHoverY = Math.cos(t * 0.8 + px[i] * 0.2 + phase[i]) * 0.010;
        customMoveX += lunarHoverX;
        customMoveY += lunarHoverY;
      } else {
        // Stone: Heavy, hard, rapid downward plummet
        const hardPlunge = Math.sin(t * freq[i] + phase[i]) * cp.waveAmp * 0.5;
        customMoveY += hardPlunge;
      }

      // Mouse interactive force
      const dx = px[i] - mouseWorldX;
      const dy = py[i] - mouseWorldY;
      const distSq = dx * dx + dy * dy;
      let mouseWindX = 0;
      let mouseWindY = 0;
      if (distSq < 24) {
        const force = (1 - Math.sqrt(distSq) / 4.9) * cp.mouseForce;
        mouseWindX = (dx / Math.sqrt(distSq + 0.1)) * force + mouseState.current.vx * 0.04;
        mouseWindY = (dy / Math.sqrt(distSq + 0.1)) * force + mouseState.current.vy * 0.04;
      }

      px[i] += customMoveX + mouseWindX;
      py[i] += customMoveY + mouseWindY;
      pz[i] += Math.sin(t * 0.3 + phase[i]) * 0.002;

      // 3-Axis dynamic tumbling speed scaled by stance
      rx[i] += rvx[i] * cp.tumbleSpeed;
      ry[i] += rvy[i] * cp.tumbleSpeed + customMoveX * 0.8;
      rz[i] += rvz[i] * cp.tumbleSpeed;

      // Boundary handling based on falling or anti-gravity floating
      if (cp.fallSpeedY < 0) {
        // Falling down (Stone / Water / Wind)
        if (py[i] < -14 || px[i] < -24) {
          px[i] = 20 + Math.random() * 8;
          py[i] = 14 + Math.random() * 6;
          phase[i] = Math.random() * Math.PI * 2;
        }
      } else {
        // Floating up (Moon Anti-Gravity)
        if (py[i] > 14 || px[i] < -24) {
          px[i] = 20 + Math.random() * 8;
          py[i] = -14 - Math.random() * 6;
          phase[i] = Math.random() * Math.PI * 2;
        }
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
  const { stance, stanceId } = useStance();

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
      // Fast drift in Toofan wind, floating orbit in Moon
      let driftSpeed = stanceId === 'wind' ? 0.03 : 0.012;
      ey[i] += evy[i] * (stanceId === 'moon' ? 1.6 : 1.0);
      const driftX = Math.sin(t * efreq[i] + ephase[i]) * driftSpeed - (stanceId === 'wind' ? 0.015 : 0.0);
      ex[i] += driftX;

      if (ey[i] > 13) {
        ey[i] = -13;
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
    const speed = stance.physics.windRibbonSpeed;
    if (lineRef1.current) {
      lineRef1.current.rotation.z = Math.sin(t * 0.35) * 0.08 - 0.04;
      lineRef1.current.position.x = ((t * speed) % 46) - 23;
      lineRef1.current.position.y = 1.5 + Math.sin(t * 0.5) * 0.4;
    }
    if (lineRef2.current) {
      lineRef2.current.rotation.z = Math.cos(t * 0.4) * 0.06 - 0.02;
      lineRef2.current.position.x = (((t + 2) * (speed * 1.2)) % 48) - 24;
      lineRef2.current.position.y = -2.2 + Math.cos(t * 0.6) * 0.5;
    }
  });

  return (
    <>
      <group ref={lineRef1} position={[-20, 1.5, -2]}>
        <mesh rotation={[0, 0, -0.08]}>
          <planeGeometry args={[16, 0.04]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={stance.physics.windRibbonOpacity * 0.6} />
        </mesh>
        <mesh position={[2, -0.4, 0.5]} rotation={[0, 0, -0.12]}>
          <planeGeometry args={[12, 0.03]} />
          <meshBasicMaterial color={stance.primary} transparent opacity={stance.physics.windRibbonOpacity} />
        </mesh>
      </group>

      <group ref={lineRef2} position={[-20, -2.2, -1.5]}>
        <mesh rotation={[0, 0, -0.06]}>
          <planeGeometry args={[14, 0.035]} />
          <meshBasicMaterial color={stance.secondary} transparent opacity={stance.physics.windRibbonOpacity * 0.8} />
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

        {/* ── 2. Dynamic Stance-Reactive 3D Momiji Leaf Storm (Toofan / Tsunami / Anti-Gravity / Hard) ── */}
        <DynamicStanceMomiji />

        {/* ── 3. Glowing Spirit Embers ── */}
        <SpiritEmbers />

        {/* ── 4. Guiding Wind Gusts ── */}
        <GuidingWind />
      </Canvas>
    </div>
  );
}
