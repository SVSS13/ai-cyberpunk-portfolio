import axios from "axios";

// Automatically uses VITE_API_URL if defined (e.g. on Vercel), else falls back to '/api/' (local Vite proxy)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/",
});

export default API;
