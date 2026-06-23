import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Terminal from "./components/Terminal";
import AdminDashboard from "./components/AdminDashboard";
import ParticleEngine from "./effects/Particles";
import BackgroundEffects from "./effects/BackgroundEffects";
import GlowEffects from "./effects/GlowEffects";
import MatrixRain from "./components/MatrixRain";
import NeonCursor from "./components/NeonCursor";
import ThemeToggle from "./components/ThemeToggle";
import GitHubStats from "./components/GitHubStats";
import MusicVisualizer from "./components/MusicVisualizer";
import ChatBot from "./components/ChatBot";
import GridBackground from "./components/GridBackground";
import Education from "./components/Education";
import API from "./services/api";

function App() {
  useEffect(() => {
    API.post("track/")
      .then(() => console.log("Visitor tracked"))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="relative bg-[#050816] text-white overflow-hidden">
      <GridBackground />
      <MatrixRain />
      <ParticleEngine />
      <BackgroundEffects />
      <GlowEffects />

      <NeonCursor />
      <ThemeToggle />
      <MusicVisualizer />
      <ChatBot />
      <Terminal />

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Projects />
        <Experience />
        <GitHubStats />
        <Resume />
        <AdminDashboard />
        <Contact />
      </main>

      <Footer />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,#00FFFF08,transparent_40%),radial-gradient(circle_at_bottom,#FF00FF08,transparent_40%)] z-[-1]" />
    </div>
  );
}

export default App;
