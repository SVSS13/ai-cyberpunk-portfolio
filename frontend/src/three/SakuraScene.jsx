import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useStance } from '../context/StanceContext';

const LEAF_COUNT = 900;
const EMBER_COUNT = 150;

// ── 1. Authentic 5-Point Japanese Autumn Maple Leaf (Momiji) Geometry ──
function createMapleLeafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.4);
  shape.lineTo(0.06, -0.1);
  shape.lineTo(0.24, -0.25);
  shape.lineTo(0.36, 0.05);
  shape.lineTo(0.16, 0.14);
  shape.lineTo(0.28, 0.42);
  shape.lineTo(0.07, 0.30);
  shape.lineTo(0, 0.55); // Top Center Lobe
  shape.lineTo(-0.07, 0.30);
  shape.lineTo(-0.28, 0.42);
  shape.lineTo(-0.16, 0.14);
  shape.lineTo(-0.36, 0.05);
  shape.lineTo(-0.24, -0.25);
  shape.lineTo(-0.06, -0.1);
  shape.closePath();

  const geo = new THREE.ShapeGeometry(shape, 8);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // Natural concave cupping & 3D aerodynamic curvature
    pos.setZ(i, (Math.sin(x * 4.5) * 0.07) + (Math.cos(y * 4.0) * 0.05));
  }
  geo.computeVertexNormals();
  return geo;
}

// ── 2. Fullscreen Animated Tsushima Background Shader ──
const BgShaderMaterial = {
  uniforms: {
    uTexture: { value: null },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uStanceColor: { value: new THREE.Color('#FFB7C5') },
    uStanceMode: { value: 0.0 }, // 0: stone (red), 1: water (blue), 2: wind (green), 3: moon (gold)
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
    uniform vec2 uMouse;
    uniform vec3 uStanceColor;
    uniform float uStanceMode;
    uniform vec2 uResolution;
    uniform float uImageAspect;
    varying vec2 vUv;

    // Fast 2D Pseudo Noise
    float hash(vec2 p) {
      p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
      return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
      // Background Cover Aspect Ratio calculation
      vec2 st = vUv;
      float screenAspect = uResolution.x / uResolution.y;
      if (screenAspect > uImageAspect) {
        float scale = screenAspect / uImageAspect;
        st.y = (st.y - 0.5) / scale + 0.5;
      } else {
        float scale = uImageAspect / screenAspect;
        st.x = (st.x - 0.5) / scale + 0.5;
      }

      // ── A. Wind Wave Motion on Grass & Spider Lily Meadow (Lower Half) ──
      float grassMask = smoothstep(0.55, 0.0, st.y);
      float windWave1 = sin(st.x * 14.0 + uTime * 2.4 + st.y * 6.0) * 0.007;
      float windWave2 = cos(st.x * 26.0 - uTime * 3.6) * 0.004;
      float windGust = noise(vec2(st.x * 5.0 - uTime * 0.9, st.y * 4.0)) * 0.009;

      st.x += (windWave1 + windWave2 + windGust) * grassMask;
      st.y += (windWave1 * 0.4) * grassMask;

      // ── B. Atmospheric Horizon Mist & Heat Drift (Midground) ──
      float mistMask = smoothstep(0.28, 0.48, st.y) * smoothstep(0.72, 0.48, st.y);
      float mistMotion = noise(vec2(st.x * 6.0 + uTime * 0.35, st.y * 5.0)) * 0.005 * mistMask;
      st.x += mistMotion;

      // ── C. Parallax Perspective Depth ──
      st += (uMouse - 0.5) * 0.022;

      vec4 tex = texture2D(uTexture, clamp(st, 0.001, 0.999));

      // ── D. Dynamic Stance Color Morphing on Flora & Atmosphere ──
      // Identify crimson/vermillion reds from flowers and sunset
      float isRed = max(0.0, tex.r - max(tex.g, tex.b) * 1.05);

      if (uStanceMode > 0.5 && uStanceMode < 1.5) {
        // Water Stance: Shift reds into deep azure & ocean cyan
        vec3 waterHue = vec3(tex.b * 0.35 + tex.r * 0.15, tex.r * 0.72 + tex.g * 0.5, tex.r * 1.15 + tex.b * 0.85);
        tex.rgb = mix(tex.rgb, waterHue, isRed * 0.88);
      } else if (uStanceMode >= 1.5 && uStanceMode < 2.5) {
        // Wind Stance: Shift reds into lush emerald & bamboo jade
        vec3 windHue = vec3(tex.r * 0.2 + tex.b * 0.15, tex.r * 0.98 + tex.g * 0.65, tex.r * 0.35 + tex.b * 0.45);
        tex.rgb = mix(tex.rgb, windHue, isRed * 0.88);
      } else if (uStanceMode >= 2.5) {
        // Moon Stance: Shift reds into golden amber & twilight amethyst
        vec3 moonHue = vec3(tex.r * 1.05 + tex.g * 0.4, tex.r * 0.88 + tex.b * 0.25, tex.b * 0.95 + tex.r * 0.55);
        tex.rgb = mix(tex.rgb, moonHue, isRed * 0.88);
      }

      // ── E. Sun Breathing Flare behind Jin Sakai ──
      vec2 sunPos = vec2(0.38, 0.64);
      float sunDist = length(st - sunPos);
      float sunPulse = (sin(uTime * 1.6) * 0.5 + 0.5) * 0.07;
      float sunGlow = max(0.0, 1.0 - sunDist * 2.2) * (0.12 + sunPulse);
      tex.rgb += uStanceColor * sunGlow;

      // Deep cinematic vignetting
      float vignette = smoothstep(1.3, 0.4, length(vUv - 0.5));
      tex.rgb *= (0.78 + 0.22 * vignette);

      gl_FragColor = tex;
    }
  `
};

function AnimatedBackground() {
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

  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1.0 - (e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
      materialRef.current.uniforms.uMouse.value.lerp(mouseRef.current, 0.05);
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      materialRef.current.uniforms.uStanceMode.value = stanceModeValue;
      materialRef.current.uniforms.uStanceColor.value.set(stance.primary);
    }
  });

  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        args={[BgShaderMaterial]}
        uniforms-uTexture-value={texture}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── 3. 3D Swirling Japanese Autumn Maple Leaves ──
function SwirlingLeaves() {
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
      px[i] = (Math.random() - 0.5) * 38;
      py[i] = Math.random() * 26 - 6;
      pz[i] = (Math.random() - 0.5) * 14;
      vx[i] = (Math.random() - 0.5) * 0.007 - 0.006; // Wind drifts leftward
      vy[i] = -(0.012 + Math.random() * 0.026);
      vz[i] = (Math.random() - 0.5) * 0.005;
      rx[i] = Math.random() * Math.PI * 2;
      ry[i] = Math.random() * Math.PI * 2;
      rz[i] = Math.random() * Math.PI * 2;
      rvx[i] = (Math.random() - 0.5) * 0.05;
      rvy[i] = (Math.random() - 0.5) * 0.04;
      rvz[i] = (Math.random() - 0.5) * 0.06;
      scale[i] = 0.07 + Math.random() * 0.16;
      phase[i] = Math.random() * Math.PI * 2;
      freq[i] = 0.25 + Math.random() * 0.65;
      windAmp[i] = 0.6 + Math.random() * 0.9;
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
      const naturalWindX = Math.sin(t * freq[i] + phase[i]) * windAmp[i] * 0.015
                         + Math.cos(t * freq[i] * 0.5 + phase[i]) * 0.009 - 0.006;
      const flutterY = Math.sin(t * freq[i] * 2.0 + phase[i]) * 0.007;

      const dx = px[i] - mouseWorldX;
      const dy = py[i] - mouseWorldY;
      const distSq = dx * dx + dy * dy;
      let mouseWindX = 0;
      let mouseWindY = 0;
      if (distSq < 24) {
        const force = (1 - Math.sqrt(distSq) / 4.9) * 0.065;
        mouseWindX = (dx / Math.sqrt(distSq + 0.1)) * force + mouseState.current.vx * 0.035;
        mouseWindY = (dy / Math.sqrt(distSq + 0.1)) * force + mouseState.current.vy * 0.035;
      }

      px[i] += vx[i] + naturalWindX + mouseWindX;
      py[i] += vy[i] + flutterY + mouseWindY;
      pz[i] += vz[i] + Math.sin(t * 0.35 + phase[i]) * 0.003;

      rx[i] += rvx[i] + Math.sin(t * 0.5 + phase[i]) * 0.004;
      ry[i] += rvy[i] + naturalWindX * 0.9;
      rz[i] += rvz[i] + Math.cos(t * 0.35 + phase[i]) * 0.003;

      // Continuous loop
      if (py[i] < -14 || px[i] < -24) {
        px[i] = 20 + Math.random() * 8;
        py[i] = 14 + Math.random() * 6;
        pz[i] = (Math.random() - 0.5) * 14;
        vy[i] = -(0.012 + Math.random() * 0.026);
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
        metalness={0.15}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ── 4. Glowing Spirit Embers ──
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

// ── 5. Guiding Wind Gust Ribbons ──
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
      <group ref={lineRef1} position={[-20, 1.5, -3]}>
        <mesh rotation={[0, 0, -0.08]}>
          <planeGeometry args={[16, 0.04]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.22} />
        </mesh>
        <mesh position={[2, -0.4, 0.5]} rotation={[0, 0, -0.12]}>
          <planeGeometry args={[12, 0.03]} />
          <meshBasicMaterial color={stance.primary} transparent opacity={0.3} />
        </mesh>
      </group>

      <group ref={lineRef2} position={[-20, -2.2, -2]}>
        <mesh rotation={[0, 0, -0.06]}>
          <planeGeometry args={[14, 0.035]} />
          <meshBasicMaterial color={stance.secondary} transparent opacity={0.22} />
        </mesh>
      </group>
    </>
  );
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

        {/* ── 1. Fullscreen Shader Animated Background (Grass Waves, Mist, Sun Pulse, Stance Hue) ── */}
        <AnimatedBackground />

        {/* ── 2. Authentic 5-Point Japanese Autumn Maple Leaves ── */}
        <SwirlingLeaves />

        {/* ── 3. Glowing Spirit Embers ── */}
        <SpiritEmbers />

        {/* ── 4. Guiding Wind Gusts ── */}
        <GuidingWind />
      </Canvas>
    </div>
  );
}
