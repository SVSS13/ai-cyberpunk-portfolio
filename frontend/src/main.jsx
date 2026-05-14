import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./index.css";

import Lenis from "@studio-freight/lenis";

/* =========================
   LENIS SMOOTH SCROLL
========================= */

const lenis = new Lenis({
  duration: 1.4,

  smoothWheel: true,

  smoothTouch: false,

  touchMultiplier: 1.5,
});

function raf(time) {
  lenis.raf(time);

  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

/* =========================
   RENDER APP
========================= */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
