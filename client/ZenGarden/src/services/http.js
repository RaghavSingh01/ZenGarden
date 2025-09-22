import axios from 'axios';
import { API_BASE_URL } from '../config/env.js';
import { getAuth, setAuth, logout } from '../store/authStore.js';

// Create instance
const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
});

// Attach token
http.interceptors.request.use((config) => {
  const auth = getAuth?.();
  const token = auth?.token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: refresh on 401
let isRefreshing = false;
let queue = [];

function resolveQueue(token, error) {
  queue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
}

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;

    if (status === 401 && !original._retry && !original.url?.includes('/auth')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(http(original));
            },
            reject
          });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        // Attempt refresh if available in store
        const refreshToken = getAuth?.()?.refreshToken;
        if (!refreshToken) throw error;

        const resp = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken });
        const nextToken = resp.data?.token || resp.data?.accessToken;
        if (!nextToken) throw error;

        setAuth?.({ token: nextToken, user: getAuth?.()?.user, refreshToken });
        resolveQueue(nextToken, null);

        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${nextToken}`;
        return http(original);
      } catch (e) {
        resolveQueue(null, e);
        logout?.();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default http;