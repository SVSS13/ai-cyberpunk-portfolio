function Footer() {
  return (
    <footer className="py-8 border-t border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <div className="text-cyan-400 font-bold tracking-widest">SVS.SUJAL</div>

        {/* Social Links */}
        <div className="flex gap-4">
          <a
            href="https://github.com/SVSS13"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#111827] border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300"
          >
            GH
          </a>
          <a
            href="https://www.linkedin.com/in/svss13"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#111827] border border-pink-500/30 flex items-center justify-center text-pink-400 hover:bg-pink-500/20 hover:border-pink-400 transition-all duration-300"
          >
            LI
          </a>
        </div>

        {/* Copyright */}
        <div className="text-gray-500 text-sm">
          © 2026 S V S Sujal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
