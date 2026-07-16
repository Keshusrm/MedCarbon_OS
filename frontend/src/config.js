export const API_BASE = (() => {
  let url = 'http://localhost:8000';
  if (import.meta.env.VITE_API_BASE_URL) {
    url = import.meta.env.VITE_API_BASE_URL;
  } else if (typeof window !== 'undefined' && window.location.hostname.includes('medcarbon-frontend.onrender.com')) {
    url = 'https://medcarbon-backend.onrender.com';
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
})();

