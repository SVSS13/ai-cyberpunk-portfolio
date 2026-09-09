import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStance } from '../context/StanceContext';

// Procedural Curved Katana Blade Geometry
function createKatanaBladeGeo() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.04, 0.08);
  shape.quadraticCurveTo(0.05, 1.8, 0.18, 3.2);
  shape.lineTo(0.12, 3.4);
  shape.lineTo(0, 3.35);
  shape.quadraticCurveTo(-0.04, 1.8, -0.04, 0);
  shape.closePath();

  const extrudeSettings = {
    steps: 16,
    depth: 0.025,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.012,
    bevelSegments: 4,
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return geo;
}

function KatanaModel({ onSlash, isSlashing }) {
  const groupRef = useRef();
  const bladeGeo = useMemo(() => createKatanaBladeGeo(), []);
  const { stance } = useStance();

  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const rotVel = useRef({ x: 0, y: 0.008 });

  useEffect(() => {
    // Mouse Events
    const onDown = (e) => {
      isDragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => { isDragging.current = false; };
    const onMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      rotVel.current.y = dx * 0.008;
      rotVel.current.x = dy * 0.008;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    // Touch Events for Mobile / Tablet
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        prevMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchEnd = () => { isDragging.current = false; };
    const onTouchMove = (e) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouse.current.x;
      const dy = e.touches[0].clientY - prevMouse.current.y;
      rotVel.current.y = dx * 0.012;
      rotVel.current.x = dy * 0.012;
      prevMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;

    if (isSlashing) {
      g.rotation.z = Math.sin(clock.elapsedTime * 25) * 0.8 - 0.4;
      g.rotation.x = -0.6;
      g.position.x = Math.sin(clock.elapsedTime * 30) * 0.3;
    } else {
      g.position.x = 0;
      g.rotation.x += rotVel.current.x;
      g.rotation.y += rotVel.current.y;
      rotVel.current.x *= 0.94;
      rotVel.current.y = (rotVel.current.y - 0.006) * 0.95 + 0.006;
      g.rotation.z = 0.25 + Math.sin(clock.elapsedTime * 1.5) * 0.06;
      g.position.y = Math.sin(clock.elapsedTime * 2) * 0.12;
    }
  });

  return (
    <group ref={groupRef} onClick={onSlash} scale={[1.1, 1.1, 1.1]} position={[0, 0, 0]}>
      {/* ── Blade (Steel with glowing Hamon) ── */}
      <mesh geometry={bladeGeo} position={[0, 0.4, 0]}>
        <meshStandardMaterial
          color="#E8E8EC"
          metalness={0.96}
          roughness={0.12}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* ── Glowing Hamon Temper Line ── */}
      <mesh position={[0.03, 0.4, 0.02]} scale={[0.03, 1.6, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={stance.primary} transparent opacity={0.75} />
      </mesh>

      {/* ── Tsuba (Golden Handguard) ── */}
      <mesh position={[0, -0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.04, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* ── Tsuka (Braided Handle / Hilt) ── */}
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 1.2, 16]} />
        <meshStandardMaterial color="#140608" roughness={0.8} />
      </mesh>

      {/* ── Tsuka Ito (Diamond wrap cord bands) ── */}
      {[0, 1, 2, 3, 4].map((idx) => (
        <mesh key={idx} position={[0, -0.85 - idx * 0.2, 0]} rotation={[0, idx * 0.4, 0]}>
          <torusGeometry args={[0.095, 0.018, 8, 24]} />
          <meshStandardMaterial color={stance.secondary} metalness={0.4} roughness={0.5} />
        </mesh>
      ))}

      {/* ── Kashira (Pommel Cap) ── */}
      <mesh position={[0, -1.92, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function Katana3D() {
  const [slashing, setSlashing] = useState(false);
  const { stance } = useStance();

  const handleSlash = () => {
    setSlashing(true);
    setTimeout(() => setSlashing(false), 380);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(240px, 40vh, 360px)',
        touchAction: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 4]} intensity={2.2} color="#FFF8F0" />
        <pointLight position={[-3, 2, 2]} intensity={1.8} color={stance.primary} />
        <pointLight position={[2, -3, 2]} intensity={1.5} color={stance.secondary} />
        <KatanaModel onSlash={handleSlash} isSlashing={slashing} />
      </Canvas>

      {slashing && (
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '140%',
            height: 4,
            background: `linear-gradient(90deg, transparent, #FFFFFF, ${stance.primary}, transparent)`,
            boxShadow: `0 0 24px #FFFFFF, 0 0 45px ${stance.primary}`,
            transform: 'rotate(-28deg)',
            animation: 'katana-slash-burst 0.35s ease-out forwards',
          }} />
        </div>
      )}

      {/* Hint Badge */}
      <div
        onClick={handleSlash}
        style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(12, 4, 8, 0.88)',
          border: '1px solid var(--glass-border)',
          borderRadius: 50,
          padding: '4px 14px',
          fontSize: '0.70rem',
          fontWeight: 700,
          color: 'var(--sakura)',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          userSelect: 'none',
          boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
        }}
      >
        ⚔️ Touch / Drag 360° · Tap to Slash
      </div>

      <style>{`
        @keyframes katana-slash-burst {
          0% { opacity: 0; transform: rotate(-35deg) scaleX(0.2); }
          50% { opacity: 1; transform: rotate(-28deg) scaleX(1.1); }
          100% { opacity: 0; transform: rotate(-22deg) scaleX(1.4); }
        }
      `}</style>
    </div>
  );
}
