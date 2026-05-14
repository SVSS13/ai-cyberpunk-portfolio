function BackgroundEffects() {
  return (
    <>
      {/* TOP LEFT GLOW */}

      <div
        className="
          fixed
          top-[-200px]
          left-[-200px]
          w-[500px]
          h-[500px]
          bg-cyan-500/20
          rounded-full
          blur-[140px]
          pointer-events-none
          -z-20
          animate-pulse
        "
      />

      {/* TOP RIGHT GLOW */}

      <div
        className="
          fixed
          top-[0]
          right-[-200px]
          w-[500px]
          h-[500px]
          bg-pink-500/20
          rounded-full
          blur-[140px]
          pointer-events-none
          -z-20
          animate-pulse
        "
      />

      {/* BOTTOM CENTER GLOW */}

      <div
        className="
          fixed
          bottom-[-200px]
          left-1/2
          -translate-x-1/2
          w-[600px]
          h-[600px]
          bg-purple-500/20
          rounded-full
          blur-[180px]
          pointer-events-none
          -z-20
        "
      />
    </>
  );
}

export default BackgroundEffects;
