import { useState, useEffect, createContext, useContext } from 'react';
import Lenis from 'lenis';
import SpaceScene from './three/SpaceScene';
import ScrollGlitter from './components/ScrollGlitter';
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

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('portfolio-theme') !== 'light');

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    let af;
    const raf = (t) => { lenis.raf(t); af = requestAnimationFrame(raf); };
    af = requestAnimationFrame(raf);
    return () => { lenis.destroy(); cancelAnimationFrame(af); };
  }, []);

  useEffect(() => {
    API.post('track/').catch(() => {});
  }, []);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {/* WebGL star field / galaxy / aurora — fixed behind everything */}
      <SpaceScene />
      {/* Glitter on scroll */}
      <ScrollGlitter />
      {/* Sticky nav */}
      <Navbar />
      {/* Main content above WebGL canvas */}
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
    </ThemeContext.Provider>
  );
}
