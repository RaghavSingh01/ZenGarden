import http from './http.js';
import { apiUrl } from '../config/env.js';

export const register = (payload) => http.post(apiUrl('/api/auth/register'), payload).then(r => r.data);
export const login = (payload) => http.post(apiUrl('/api/auth/login'), payload).then(r => r.data);
export const getProfile = () => http.get(apiUrl('/api/auth/profile')).then(r => r.data);
export const forgotPassword = (payload) => http.post(apiUrl('/api/auth/password/forgot'), payload).then(r => r.data);
export const resetPassword = (token, payload) => http.put(apiUrl(`/api/auth/password/reset/${token}`), payload).then(r => r.data);