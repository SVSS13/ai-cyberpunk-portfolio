import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStance } from '../context/StanceContext';

const PETAL_COUNT = 1200;
const GRASS_COUNT = 1400;

// ── 1. Curved Petal Geometry ──
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

// ── 2. Tapered Grass Blade & Spider Lily Geometry ──
function createGrassBladeGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.06, 0);
  shape.lineTo(0.06, 0);
  shape.quadraticCurveTo(0.04, 1.0, 0.01, 1.8);
  shape.lineTo(0, 2.2); // Pointed grass tip
  shape.quadraticCurveTo(-0.04, 1.0, -0.06, 0);
  shape.closePath();
  const geo = new THREE.ShapeGeometry(shape, 6);
  return geo;
}

// ── 3. 3D Instanced Swaying Grass & Flower Stalks ──
function SwayingGrassField() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => createGrassBladeGeometry(), []);
  const { stance } = useStance();

  const gx = useMemo(() => new Float32Array(GRASS_COUNT), []);
  const gy = useMemo(() => new Float32Array(GRASS_COUNT), []);
  const gz = useMemo(() => new Float32Array(GRASS_COUNT), []);
  const baseRotZ = useMemo(() => new Float32Array(GRASS_COUNT), []);
  const scaleY = useMemo(() => new Float32Array(GRASS_COUNT), []);
  const phase = useMemo(() => new Float32Array(GRASS_COUNT), []);
  const freq = useMemo(() => new Float32Array(GRASS_COUNT), []);

  useMemo(() => {
    for (let i = 0; i < GRASS_COUNT; i++) {
      gx[i] = (Math.random() - 0.5) * 36;
      gy[i] = -7.5 + (Math.random() - 0.5) * 2.2; // Anchored to bottom ground
      gz[i] = (Math.random() - 0.5) * 14 - 2;
      baseRotZ[i] = (Math.random() - 0.5) * 0.25 - 0.08; // natural wind lean
      scaleY[i] = 0.7 + Math.random() * 0.8;
      phase[i] = Math.random() * Math.PI * 2;
      freq[i] = 0.8 + Math.random() * 1.4;
    }
  }, [gx, gy, gz, baseRotZ, scaleY, phase, freq]);

  // Update grass blade colors when stance changes
  useEffect(() => {
    if (!meshRef.current) return;
    const colors = stance.particleColors.map(c => new THREE.Color(c));
    for (let i = 0; i < GRASS_COUNT; i++) {
      const col = colors[i % colors.length];
      meshRef.current.setColorAt(i, col);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [stance]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < GRASS_COUNT; i++) {
      // Natural wave rolling across grass field
      const wave = Math.sin(t * freq[i] + gx[i] * 0.35 + phase[i]) * 0.22
                 + Math.cos(t * 1.6 + gz[i] * 0.2) * 0.08;

      dummy.position.set(gx[i], gy[i], gz[i]);
      dummy.rotation.set(0, 0, baseRotZ[i] + wave);
      dummy.scale.set(0.8, scaleY[i], 0.8);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geo, undefined, GRASS_COUNT]}>
      <meshStandardMaterial
        side={THREE.DoubleSide}
        transparent
        opacity={0.82}
        roughness={0.7}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ── 4. 3D Swaying Japanese Maple Tree (Flank Silhouettes) ──
function SwayingTree({ position = [-12, -4, -8], scale = 1.6, flip = false }) {
  const groupRef = useRef();
  const canopy1Ref = useRef();
  const canopy2Ref = useRef();
  const canopy3Ref = useRef();
  const { stance } = useStance();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Trunk harmonic wind sway
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.9 + (flip ? 1 : 0)) * 0.04 - (flip ? -0.05 : 0.05);
    }
    // Canopy leaf cluster oscillations
    if (canopy1Ref.current) {
      canopy1Ref.current.rotation.y = Math.sin(t * 1.4) * 0.1;
      canopy1Ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.03);
    }
    if (canopy2Ref.current) {
      canopy2Ref.current.rotation.z = Math.cos(t * 1.8) * 0.08;
    }
    if (canopy3Ref.current) {
      canopy3Ref.current.rotation.y = Math.cos(t * 1.6) * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[flip ? -scale : scale, scale, scale]}>
      {/* ── Curved Trunk (Gnarled Japanese Maple) ── */}
      <mesh position={[0, 2.5, 0]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.22, 0.45, 5.5, 12]} />
        <meshStandardMaterial color="#180608" roughness={0.9} />
      </mesh>
      {/* ── Main Branch Left ── */}
      <mesh position={[-1.2, 4.2, 0]} rotation={[0, 0, 0.65]}>
        <cylinderGeometry args={[0.14, 0.22, 3.2, 10]} />
        <meshStandardMaterial color="#180608" roughness={0.9} />
      </mesh>
      {/* ── Main Branch Right ── */}
      <mesh position={[1.1, 4.6, 0.2]} rotation={[0, 0, -0.55]}>
        <cylinderGeometry args={[0.12, 0.2, 2.8, 10]} />
        <meshStandardMaterial color="#180608" roughness={0.9} />
      </mesh>

      {/* ── Foliage Canopy Clumps (Stance Reactive) ── */}
      <mesh ref={canopy1Ref} position={[-2.2, 5.2, 0]}>
        <dodecahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial
          color={stance.secondary}
          transparent
          opacity={0.88}
          roughness={0.65}
        />
      </mesh>

      <mesh ref={canopy2Ref} position={[1.8, 5.6, 0.3]}>
        <dodecahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial
          color={stance.primary}
          transparent
          opacity={0.85}
          roughness={0.65}
        />
      </mesh>

      <mesh ref={canopy3Ref} position={[0, 6.2, -0.2]}>
        <dodecahedronGeometry args={[2.1, 1]} />
        <meshStandardMaterial
          color={stance.accent}
          transparent
          opacity={0.88}
          roughness={0.65}
        />
      </mesh>
    </group>
  );
}

// ── 5. Falling Petals & Wind Dynamics ──
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
      px[i] = (Math.random() - 0.5) * 38;
      py[i] = Math.random() * 26 - 6;
      pz[i] = (Math.random() - 0.5) * 16;
      vx[i] = (Math.random() - 0.5) * 0.005 - 0.004;
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

    const targetCamX = mouseState.current.x * 1.2;
    const targetCamY = mouseState.current.y * 0.8;
    camera.position.x += (targetCamX - camera.position.x) * 0.015;
    camera.position.y += (targetCamY - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);

    mouseState.current.vx *= 0.94;
    mouseState.current.vy *= 0.94;

    const mouseWorldX = mouseState.current.x * 10;
    const mouseWorldY = mouseState.current.y * 6;

    for (let i = 0; i < PETAL_COUNT; i++) {
      const naturalWindX = Math.sin(t * freq[i] + phase[i]) * windAmp[i] * 0.012
                         + Math.cos(t * freq[i] * 0.4 + phase[i]) * 0.007 - 0.003;
      const flutterY = Math.sin(t * freq[i] * 1.8 + phase[i]) * 0.005;

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
    <instancedMesh ref={meshRef} args={[geo, undefined, PETAL_COUNT]}>
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

// ── 6. Guiding Wind Gust Ribbons ──
function GuidingWind() {
  const lineRef = useRef();

  useFrame(({ clock }) => {
    if (lineRef.current) {
      lineRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.4) * 0.1;
      lineRef.current.position.x = ((clock.elapsedTime * 6) % 40) - 20;
    }
  });

  return (
    <group ref={lineRef} position={[-20, 2, -6]}>
      <mesh rotation={[0, 0, -0.1]}>
        <planeGeometry args={[14, 0.04]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.18} />
      </mesh>
      <mesh position={[2, -0.6, 1]} rotation={[0, 0, -0.15]}>
        <planeGeometry args={[10, 0.03]} />
        <meshBasicMaterial color="#FFB7C5" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

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
        <directionalLight position={[6, 8, 5]} intensity={1.4} color="#FFE4D6" />
        <pointLight position={[-6, -4, 3]} intensity={1.2} color={stance.secondary} />
        <pointLight position={[0, 4, 2]} intensity={0.9} color={stance.primary} />

        {/* ── 3D Swaying Japanese Trees on Left & Right Flanks ── */}
        <SwayingTree position={[-11, -3.5, -6]} scale={1.7} />
        <SwayingTree position={[11, -3.2, -7]} scale={1.5} flip={true} />

        {/* ── 3D Instanced Swaying Grass & Lily Field ── */}
        <SwayingGrassField />

        {/* ── 1200 Falling Petals & Guiding Wind ── */}
        <FallingPetals />
        <GuidingWind />
      </Canvas>
    </div>
  );
}
