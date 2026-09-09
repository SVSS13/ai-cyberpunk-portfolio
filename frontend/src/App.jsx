import { useState, useEffect, createContext, useContext } from 'react';
import { StanceProvider } from './context/StanceContext';
import SakuraScene from './three/SakuraScene';
import GlobalBrush from './components/GlobalBrush';
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
    API.post('track/').catch(() => {});
  }, []);

  return (
    <StanceProvider>
      <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
        {/* Three.js 3D WebGL Torii Gates + Pagoda + Lanterns + Falling Petals */}
        <SakuraScene />
        {/* Full-UI Japanese Calligraphy Sumi-e Brush */}
        <GlobalBrush />
        {/* Blossom particle burst on scroll */}
        <ScrollGlitter />
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
      </ThemeContext.Provider>
    </StanceProvider>
  );
}
