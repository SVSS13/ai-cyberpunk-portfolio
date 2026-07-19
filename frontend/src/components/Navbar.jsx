import { useState, useEffect } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050816]/90 backdrop-blur-lg border-b border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.1)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1
          className="text-2xl font-bold tracking-widest text-cyan-400 cursor-pointer hover:text-pink-400 transition-colors duration-300"
          style={{ textShadow: "0 0 20px rgba(0,255,255,0.5)" }}
          onClick={() => scrollToSection("hero")}
        >
          SVS.SUJAL
        </h1>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8">
          {[
            { label: "Home", id: "hero" },
            { label: "About", id: "about" },
            { label: "Skills", id: "skills" },
            { label: "Projects", id: "projects" },
            { label: "Experience", id: "experience" },
            { label: "Education", id: "education" },
            { label: "Resume", id: "resume" },
            { label: "Contact", id: "contact" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors duration-300 relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_#00FFFF]" />
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-cyan-400 text-2xl">☰</button>
      </div>
    </nav>
  );
}

export default Navbar;
