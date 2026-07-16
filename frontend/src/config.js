export const API_BASE = (() => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('medcarbon-frontend.onrender.com')) {
    return 'https://medcarbon-backend.onrender.com';
  }
  return 'http://localhost:8000';
})();
