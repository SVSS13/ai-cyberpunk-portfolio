import { useEffect } from "react";

function NeonCursor() {
  useEffect(() => {
    const cursor = document.createElement("div");

    const trail = document.createElement("div");

    /* =========================
       MAIN CURSOR
    ========================= */

    cursor.style.width = "22px";

    cursor.style.height = "22px";

    cursor.style.border = "2px solid #00FFFF";

    cursor.style.borderRadius = "50%";

    cursor.style.position = "fixed";

    cursor.style.pointerEvents = "none";

    cursor.style.zIndex = "9999";

    cursor.style.transform = "translate(-50%, -50%)";

    cursor.style.transition =
      "width 0.25s ease, height 0.25s ease, border 0.25s ease";

    cursor.style.boxShadow = "0 0 15px #00FFFF, 0 0 30px #00FFFF";

    cursor.style.backdropFilter = "blur(4px)";

    /* =========================
       CURSOR TRAIL
    ========================= */

    trail.style.width = "8px";

    trail.style.height = "8px";

    trail.style.background = "#FF00FF";

    trail.style.borderRadius = "50%";

    trail.style.position = "fixed";

    trail.style.pointerEvents = "none";

    trail.style.zIndex = "9998";

    trail.style.transform = "translate(-50%, -50%)";

    trail.style.boxShadow = "0 0 20px #FF00FF, 0 0 40px #FF00FF";

    trail.style.transition = "all 0.08s linear";

    document.body.appendChild(cursor);

    document.body.appendChild(trail);

    const moveCursor = (e) => {
      const x = e.clientX;

      const y = e.clientY;

      cursor.style.left = `${x}px`;

      cursor.style.top = `${y}px`;

      setTimeout(() => {
        trail.style.left = `${x}px`;

        trail.style.top = `${y}px`;
      }, 40);
    };

    const handleHover = () => {
      cursor.style.width = "40px";

      cursor.style.height = "40px";

      cursor.style.border = "2px solid #FF00FF";

      cursor.style.boxShadow = "0 0 20px #FF00FF, 0 0 45px #FF00FF";
    };

    const resetCursor = () => {
      cursor.style.width = "22px";

      cursor.style.height = "22px";

      cursor.style.border = "2px solid #00FFFF";

      cursor.style.boxShadow = "0 0 15px #00FFFF, 0 0 30px #00FFFF";
    };

    window.addEventListener("mousemove", moveCursor);

    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea",
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);

      el.addEventListener("mouseleave", resetCursor);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);

        el.removeEventListener("mouseleave", resetCursor);
      });

      document.body.removeChild(cursor);

      document.body.removeChild(trail);
    };
  }, []);

  return null;
}

export default NeonCursor;
