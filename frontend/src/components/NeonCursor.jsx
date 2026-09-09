import { useEffect } from "react";

function NeonCursor() {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className =
      "fixed w-5 h-5 rounded-full border-2 border-cyan-400 pointer-events-none z-[9999] transition-transform duration-100 mix-blend-difference";
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX - 10}px`;
      cursor.style.top = `${e.clientY - 10}px`;
    };

    const growCursor = () => (cursor.style.transform = "scale(2)");
    const shrinkCursor = () => (cursor.style.transform = "scale(1)");

    window.addEventListener("mousemove", moveCursor);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", growCursor);
      el.addEventListener("mouseleave", shrinkCursor);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeChild(cursor);
    };
  }, []);

  return null;
}

export default NeonCursor;
