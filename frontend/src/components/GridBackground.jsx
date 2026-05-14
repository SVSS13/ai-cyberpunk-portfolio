function GridBackground() {
  return (
    <div
      className="
        fixed
        inset-0
        -z-30
        overflow-hidden
        pointer-events-none
      "
    >
      {/* =========================
          MAIN GRID
      ========================= */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.08]
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(0,255,255,0.18) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(0,255,255,0.18) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* =========================
          CYBER GLOW OVERLAY
      ========================= */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,#00FFFF10,transparent_55%)]
        "
      />

      {/* =========================
          TOP CYAN GLOW
      ========================= */}

      <div
        className="
          absolute
          top-[-250px]
          left-[-250px]
          w-[600px]
          h-[600px]
          rounded-full
          bg-cyan-500/10
          blur-[160px]
        "
      />

      {/* =========================
          BOTTOM PINK GLOW
      ========================= */}

      <div
        className="
          absolute
          bottom-[-250px]
          right-[-250px]
          w-[600px]
          h-[600px]
          rounded-full
          bg-pink-500/10
          blur-[160px]
        "
      />
    </div>
  );
}

export default GridBackground;
