import { useEffect } from "react";

import { motion } from "framer-motion";

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
      .then(() => {
        console.log("Visitor tracked");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="
        relative
        bg-[#050816]
        text-white
        overflow-hidden
      "
    >
      {/* =========================
          BACKGROUND EFFECTS
      ========================= */}

      <GridBackground />

      <MatrixRain />

      <ParticleEngine />

      <BackgroundEffects />

      <GlowEffects />

      <div
        className="
          fixed
          top-[-200px]
          left-[-200px]
          w-[500px]
          h-[500px]
          bg-cyan-500/10
          blur-[140px]
          rounded-full
          -z-10
        "
      />

      <div
        className="
          fixed
          bottom-[-200px]
          right-[-200px]
          w-[500px]
          h-[500px]
          bg-pink-500/10
          blur-[140px]
          rounded-full
          -z-10
        "
      />

      {/* =========================
          UI EFFECTS
      ========================= */}

      <NeonCursor />

      <ThemeToggle />

      <MusicVisualizer />

      <ChatBot />

      <Terminal />

      {/* =========================
          MAIN CONTENT
      ========================= */}

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

      {/* =========================
          GLOBAL OVERLAY
      ========================= */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          bg-[radial-gradient(circle_at_top,#00FFFF08,transparent_40%),radial-gradient(circle_at_bottom,#FF00FF08,transparent_40%)]
          z-[-1]
        "
      />
    </motion.div>
  );
}

export default App;
