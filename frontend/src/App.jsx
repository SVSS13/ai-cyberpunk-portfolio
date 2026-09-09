import { useState, useEffect, createContext, useContext } from 'react';
import { StanceProvider, useStance } from './context/StanceContext';
import SakuraScene from './three/SakuraScene';
import GlobalBrush from './components/GlobalBrush';
import ScrollGlitter from './components/ScrollGlitter';
import TsushimaLeftHUD from './components/TsushimaLeftHUD';
import TsushimaRightHUD from './components/TsushimaRightHUD';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import GitHubStats from './components/GitHubStats';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import API from './services/api';

export const ThemeContext = createContext({ dark: true, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

// ── Cinematic Crossfading Stance Background Realms ──
function TsushimaBackground() {
  const { stanceId } = useStance();
  const isWater = stanceId === 'water';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none' }}>
      {/* ── Realm 1: Jin Sakai Spider Lily Meadow (Stone / Wind / Moon) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/samurai-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat',
          opacity: isWater ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out',
        }}
      />

      {/* ── Realm 2: Waterfall Mountain Temple & Shrine (Water Stance) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/temple-shrine-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
          opacity: isWater ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
        }}
      />

      {/* ── Deep Atmospheric Vignette & Contrast Overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,3,6,0.45) 0%, rgba(8,3,6,0.30) 35%, rgba(8,3,6,0.55) 65%, rgba(8,3,6,0.82) 100%)',
        }}
      />
    </div>
  );
}

function MainApp() {
  return (
    <>
      {/* Fullscreen Stance-Reactive Cinematic Background Crossfader */}
      <TsushimaBackground />

      {/* Three.js 3D WebGL Falling Momiji Leaves + Stance Physics */}
      <SakuraScene />

      {/* Full-UI Japanese Calligraphy Sumi-e Brush */}
      <GlobalBrush />

      {/* Blossom particle burst on scroll */}
      <ScrollGlitter />

      {/* ── Left Flank: Sakai War Banner + Resolve Orbs + Ghost Gauge ── */}
      <TsushimaLeftHUD />

      {/* ── Right Flank: Legend Rank + Waypoint Plaques + Kunai ── */}
      <TsushimaRightHUD />

      {/* Sticky Navbar with Tsushima Stance Dial */}
      <Navbar />

      {/* Main Sections */}
      <main style={{ position: 'relative', zIndex: 1, paddingTop: 64 }}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <GitHubStats />
        <Resume />
        <Contact />
      </main>
      <Footer />
      <ChatBot />
    </>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('portfolio-theme') !== 'light');

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    API.post('track/').catch(() => {});
  }, []);

  return (
    <StanceProvider>
      <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
        <MainApp />
      </ThemeContext.Provider>
    </StanceProvider>
  );
}
