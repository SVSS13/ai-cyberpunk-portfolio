import { useState, useEffect, createContext, useContext } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Education from "./components/Education";
import GitHubStats from "./components/GitHubStats";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import API from "./services/api";

// ─── Theme Context ────────────────────────────────────────────────────────────
export const ThemeContext = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

function App() {
  // Default: light mode
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("portfolio-theme");
    return saved === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("portfolio-theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("portfolio-theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    API.post("track/")
      .then(() => console.log("Visitor tracked"))
      .catch((err) => console.log(err));
  }, []);

  const toggle = () => setDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        {/* Sticky Navbar */}
        <Navbar />

        {/* Main content — padded below navbar */}
        <main style={{ paddingTop: "64px" }}>
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

        {/* Floating ChatBot */}
        <ChatBot />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
