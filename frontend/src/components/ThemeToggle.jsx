import { useState, useEffect } from "react";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
      root.classList.remove("light-mode");
      root.classList.add("dark-mode");
      root.setAttribute("data-theme", "dark");
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark-mode");
      root.classList.add("light-mode");
      root.setAttribute("data-theme", "light");
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDark) {
      root.classList.add("dark-mode");
      root.setAttribute("data-theme", "dark");
      body.classList.add("dark-mode");
    } else {
      root.classList.add("light-mode");
      root.setAttribute("data-theme", "light");
      body.classList.add("light-mode");
    }
  }, []);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed top-5 right-5 z-50 w-12 h-12 rounded-full bg-[#111827] border border-cyan-500/30 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-all duration-300 hover:scale-110"
      aria-label="Toggle Theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

export default ThemeToggle;
