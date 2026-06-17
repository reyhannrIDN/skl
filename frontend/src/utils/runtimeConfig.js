const fallbackApiBaseUrl = `${window.location.protocol}//${window.location.hostname}:8000/api`;

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl).replace(/\/$/, '');
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');
export const STORAGE_BASE_URL = (import.meta.env.VITE_STORAGE_BASE_URL || `${API_ORIGIN}/storage`).replace(/\/$/, '');
