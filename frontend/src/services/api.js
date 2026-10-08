import axios from "axios";

// Automatically uses VITE_API_URL if defined (e.g. on Vercel), else falls back to '/api/' (local Vite proxy)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/",
  timeout: 55000, // 55s timeout accommodating Render cold starts
});

// Cold-Start Auto-Retry Interceptor for Network Drops / 502 / 504 Gateway Timeouts
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || config._noRetry) {
      return Promise.reject(error);
    }

    const isNetworkOrTimeout =
      !error.response ||
      error.code === "ECONNABORTED" ||
      error.message?.includes("Network Error") ||
      error.message?.includes("timeout");

    const isGatewayError =
      error.response && [502, 503, 504].includes(error.response.status);

    if ((isNetworkOrTimeout || isGatewayError) && (config._retryCount || 0) < 2) {
      config._retryCount = (config._retryCount || 0) + 1;
      const delayMs = config._retryCount * 2500;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return API(config);
    }

    return Promise.reject(error);
  }
);

/**
 * Lightweight probe to check if the backend is awake
 * @returns {Promise<{online: boolean, latencyMs: number}>}
 */
export async function probeBackendHealth(timeoutMs = 8000) {
  const start = performance.now();
  try {
    const res = await axios.get(
      (import.meta.env.VITE_API_URL || "/api/").replace(/\/+$/, "") + "/health/",
      {
        timeout: timeoutMs,
        headers: { "Cache-Control": "no-cache" },
      }
    );
    const latencyMs = Math.round(performance.now() - start);
    return { online: res.status === 200, latencyMs };
  } catch {
    // Also try root /api/ fallback
    try {
      const resFallback = await axios.get(
        import.meta.env.VITE_API_URL || "/api/",
        {
          timeout: timeoutMs,
          headers: { "Cache-Control": "no-cache" },
        }
      );
      const latencyMs = Math.round(performance.now() - start);
      return { online: resFallback.status === 200, latencyMs };
    } catch {
      return { online: false, latencyMs: 0 };
    }
  }
}

export default API;

