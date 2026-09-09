import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useStance } from '../context/StanceContext';

const LEAF_COUNT = 850;
const EMBER_COUNT = 140;
const MIST_COUNT = 18;

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
  shape.lineTo(0, 0.58); // Top Center Lobe
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
    // Subtle natural 3D curve
    pos.setZ(i, (Math.sin(x * 4.0) * 0.05) + (Math.cos(y * 3.5) * 0.04));
  }
  geo.computeVertexNormals();
  return geo;
}

// ── 2. Crisp, Stable Background with Dynamic Stance Color Grading & Sun Pulse (NO UV WARPING) ──
const BgShaderMaterial = {
  uniforms: {
    uTexture: { value: null },
    uTime: { value: 0 },
    uStanceColor: { value: new THREE.Color('#FFB7C5') },
    uStanceMode: { value: 0.0 }, // 0: stone, 1: water, 2: wind, 3: moon
    uResolution: { value: new THREE.Vector2(1, 1) },
    uImageAspect: { value: 860 / 484 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec3 uStanceColor;
    uniform float uStanceMode;
    uniform vec2 uResolution;
    uniform float uImageAspect;
    varying vec2 vUv;

    void main() {
      // Clean, exact cover aspect ratio calculation (100% crisp, zero warping)
      vec2 st = vUv;
      float screenAspect = uResolution.x / uResolution.y;
      if (screenAspect > uImageAspect) {
        float scale = screenAspect / uImageAspect;
        st.y = (st.y - 0.5) / scale + 0.5;
      } else {
        float scale = uImageAspect / screenAspect;
        st.x = (st.x - 0.5) / scale + 0.5;
      }

      vec4 tex = texture2D(uTexture, clamp(st, 0.0, 1.0));

      // Stance Color Harmony on the Crimson Lighting
      float isRed = max(0.0, tex.r - max(tex.g, tex.b) * 1.08);

      if (uStanceMode > 0.5 && uStanceMode < 1.5) {
        // Water Stance: Azure / Ocean
        vec3 waterHue = vec3(tex.b * 0.35 + tex.r * 0.15, tex.r * 0.7 + tex.g * 0.5, tex.r * 1.1 + tex.b * 0.8);
        tex.rgb = mix(tex.rgb, waterHue, isRed * 0.85);
      } else if (uStanceMode >= 1.5 && uStanceMode < 2.5) {
        // Wind Stance: Emerald / Jade
        vec3 windHue = vec3(tex.r * 0.2 + tex.b * 0.15, tex.r * 0.95 + tex.g * 0.6, tex.r * 0.35 + tex.b * 0.45);
        tex.rgb = mix(tex.rgb, windHue, isRed * 0.85);
      } else if (uStanceMode >= 2.5) {
        // Moon Stance: Golden Twilight
        vec3 moonHue = vec3(tex.r * 1.05 + tex.g * 0.4, tex.r * 0.85 + tex.b * 0.25, tex.b * 0.95 + tex.r * 0.55);
        tex.rgb = mix(tex.rgb, moonHue, isRed * 0.85);
      }

      // Soft Sun Breathing Flare behind Jin Sakai (natural light pulse)
      vec2 sunPos = vec2(0.38, 0.64);
      float sunDist = length(st - sunPos);
      float sunPulse = (sin(uTime * 1.4) * 0.5 + 0.5) * 0.06;
      float sunGlow = max(0.0, 1.0 - sunDist * 2.4) * (0.10 + sunPulse);
      tex.rgb += uStanceColor * sunGlow;

      // Cinematic Vignette
      float vignette = smoothstep(1.35, 0.35, length(vUv - 0.5));
      tex.rgb *= (0.80 + 0.20 * vignette);

      gl_FragColor = tex;
    }
  `
};

function CrispBackground() {
  const { viewport, size } = useThree();
  const texture = useLoader(THREE.TextureLoader, '/samurai-bg.png');
  const materialRef = useRef();
  const { stance, stanceId } = useStance();

  const stanceModeValue = useMemo(() => {
    switch (stanceId) {
      case 'water': return 1.0;
      case 'wind': return 2.0;
      case 'moon': return 3.0;
      default: return 0.0;
    }
  }, [stanceId]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      materialRef.current.uniforms.uStanceMode.value = stanceModeValue;
      materialRef.current.uniforms.uStanceColor.value.set(stance.primary);
    }
  });

  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[viewport.width * 1.05, viewport.height * 1.05]} />
      <shaderMaterial
        ref={materialRef}
        args={[BgShaderMaterial]}
        uniforms-uTexture-value={texture}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── 3. Realistic 3D Tumbling Japanese Maple Leaves (Momiji) ──
function RealisticLeaves() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => createMapleLeafGeometry(), []);
  const { stance } = useStance();

  const px = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const py = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const pz = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const vx = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const vy = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const vz = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const rx = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const ry = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const rz = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const rvx = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const rvy = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const rvz = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const scale = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const phase = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const freq = useMemo(() => new Float32Array(LEAF_COUNT), []);
  const windAmp = useMemo(() => new Float32Array(LEAF_COUNT), []);

  useMemo(() => {
    for (let i = 0; i < LEAF_COUNT; i++) {
      px[i] = (Math.random() - 0.5) * 36;
      py[i] = Math.random() * 26 - 6;
      pz[i] = (Math.random() - 0.5) * 12;
      vx[i] = -(0.008 + Math.random() * 0.016); // Realistic leftward wind drift
      vy[i] = -(0.012 + Math.random() * 0.022); // Terminal gravity fall
      vz[i] = (Math.random() - 0.5) * 0.006;
      rx[i] = Math.random() * Math.PI * 2;
      ry[i] = Math.random() * Math.PI * 2;
      rz[i] = Math.random() * Math.PI * 2;
      rvx[i] = (Math.random() - 0.5) * 0.04;
      rvy[i] = (Math.random() - 0.5) * 0.035;
      rvz[i] = (Math.random() - 0.5) * 0.05;
      scale[i] = 0.08 + Math.random() * 0.16;
      phase[i] = Math.random() * Math.PI * 2;
      freq[i] = 0.4 + Math.random() * 0.8;
      windAmp[i] = 0.6 + Math.random() * 0.8;
    }
  }, [px, py, pz, vx, vy, vz, rx, ry, rz, rvx, rvy, rvz, scale, phase, freq, windAmp]);

  // Update leaf colors dynamically with stance
  useEffect(() => {
    if (!meshRef.current) return;
    const colors = stance.particleColors.map(hex => new THREE.Color(hex));
    for (let i = 0; i < LEAF_COUNT; i++) {
      const color = colors[i % colors.length];
      meshRef.current.setColorAt(i, color);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [stance]);

  // Interactive mouse wind
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

    const mouseWorldX = mouseState.current.x * 10;
    const mouseWorldY = mouseState.current.y * 6;

    for (let i = 0; i < LEAF_COUNT; i++) {
      // Natural aerodynamic flutter and wind gusts
      const gustX = Math.sin(t * freq[i] + phase[i]) * windAmp[i] * 0.012;
      const flutterY = Math.cos(t * freq[i] * 1.8 + phase[i]) * 0.006;

      const dx = px[i] - mouseWorldX;
      const dy = py[i] - mouseWorldY;
      const distSq = dx * dx + dy * dy;
      let mouseWindX = 0;
      let mouseWindY = 0;
      if (distSq < 22) {
        const force = (1 - Math.sqrt(distSq) / 4.7) * 0.06;
        mouseWindX = (dx / Math.sqrt(distSq + 0.1)) * force + mouseState.current.vx * 0.03;
        mouseWindY = (dy / Math.sqrt(distSq + 0.1)) * force + mouseState.current.vy * 0.03;
      }

      px[i] += vx[i] + gustX + mouseWindX;
      py[i] += vy[i] + flutterY + mouseWindY;
      pz[i] += vz[i] + Math.sin(t * 0.3 + phase[i]) * 0.002;

      // Realistic tumbling on all 3 axes
      rx[i] += rvx[i] + Math.sin(t * 0.4 + phase[i]) * 0.003;
      ry[i] += rvy[i] + gustX * 0.7;
      rz[i] += rvz[i] + Math.cos(t * 0.3 + phase[i]) * 0.003;

      // Seamless wrap-around
      if (py[i] < -13 || px[i] < -22) {
        px[i] = 18 + Math.random() * 8;
        py[i] = 13 + Math.random() * 6;
        pz[i] = (Math.random() - 0.5) * 12;
        vy[i] = -(0.012 + Math.random() * 0.022);
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
    <instancedMesh ref={meshRef} args={[geo, undefined, LEAF_COUNT]}>
      <meshStandardMaterial
        side={THREE.DoubleSide}
        transparent
        opacity={0.92}
        roughness={0.5}
        metalness={0.12}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ── 4. Realistic Drifting Atmospheric Horizon Mist (True 3D Soft Volumes) ──
function DriftingHorizonMist() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => new THREE.PlaneGeometry(8, 2.5), []);
  const { stance } = useStance();

  const mx = useMemo(() => new Float32Array(MIST_COUNT), []);
  const my = useMemo(() => new Float32Array(MIST_COUNT), []);
  const mz = useMemo(() => new Float32Array(MIST_COUNT), []);
  const mvx = useMemo(() => new Float32Array(MIST_COUNT), []);
  const mscale = useMemo(() => new Float32Array(MIST_COUNT), []);
  const mphase = useMemo(() => new Float32Array(MIST_COUNT), []);

  useMemo(() => {
    for (let i = 0; i < MIST_COUNT; i++) {
      mx[i] = (Math.random() - 0.5) * 34;
      my[i] = -1.5 + (Math.random() - 0.5) * 2.0; // Anchored across the midground horizon
      mz[i] = -3.0 + (Math.random() - 0.5) * 2.0;
      mvx[i] = -(0.003 + Math.random() * 0.006); // Slow atmospheric drift
      mscale[i] = 1.0 + Math.random() * 0.8;
      mphase[i] = Math.random() * Math.PI * 2;
    }
  }, [mx, my, mz, mvx, mscale, mphase]);

  useEffect(() => {
    if (!meshRef.current) return;
    const mistCol = new THREE.Color(stance.primary);
    for (let i = 0; i < MIST_COUNT; i++) {
      meshRef.current.setColorAt(i, mistCol);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [stance]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < MIST_COUNT; i++) {
      mx[i] += mvx[i];
      if (mx[i] < -20) {
        mx[i] = 20;
      }
      const breathe = Math.sin(t * 0.5 + mphase[i]) * 0.15;
      dummy.position.set(mx[i], my[i] + breathe * 0.2, mz[i]);
      dummy.scale.set(mscale[i] * (1 + breathe * 0.1), mscale[i], 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geo, undefined, MIST_COUNT]}>
      <meshBasicMaterial
        transparent
        opacity={0.065}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

// ── 5. Tsushima Glowing Spirit Embers ──
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

// ── 6. Guiding Wind Gust Ribbons ──
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

// ── 7. Camera Parallax ──
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
    // Smooth cinematic camera parallax (0 distortion, true 3D perspective)
    const targetX = mouseState.current.x * 0.6;
    const targetY = mouseState.current.y * 0.4;
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── 8. Main WebGL Scene ──
export default function SakuraScene() {
  const { stance } = useStance();

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.7} color={stance.primary} />
        <directionalLight position={[6, 8, 5]} intensity={1.3} color="#FFE4D6" />
        <pointLight position={[-6, -4, 3]} intensity={1.2} color={stance.secondary} />
        <pointLight position={[6, 4, 2]} intensity={1.0} color={stance.primary} />

        {/* ── 1. Smooth 3D Perspective Parallax ── */}
        <CameraParallax />

        {/* ── 2. Clean, Crisp, Stable Background (No underwater warping) ── */}
        <CrispBackground />

        {/* ── 3. Realistic Drifting Horizon Mist ── */}
        <DriftingHorizonMist />

        {/* ── 4. Realistic 3D Aerodynamic Tumbling Japanese Maple Leaves ── */}
        <RealisticLeaves />

        {/* ── 5. Glowing Spirit Embers ── */}
        <SpiritEmbers />

        {/* ── 6. Guiding Wind Gusts ── */}
        <GuidingWind />
      </Canvas>
    </div>
  );
}
