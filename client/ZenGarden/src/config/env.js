// Centralized environment access for Vite
// Define these in your .env files (remember VITE_ prefix):
// VITE_API_BASE_URL=http://localhost:5000
// VITE_APP_NAME=ZenGarden

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'ZenGarden';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const IS_DEV = Boolean(import.meta.env.DEV);
export const IS_PROD = Boolean(import.meta.env.PROD);
export const MODE = import.meta.env.MODE;
export const BASE_URL = import.meta.env.BASE_URL;

// Helper: build full API URL safely
export const apiUrl = (path = '') => {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${base}/${p}`;
};