import http from './http.js';
import { apiUrl } from '../config/env.js';

export const listUsers = (params = {}) => http.get(apiUrl('/api/users'), { params }).then(r => r.data);
export const getUser = (id) => http.get(apiUrl(`/api/users/${id}`)).then(r => r.data);
export const createUser = (payload) => http.post(apiUrl('/api/users'), payload).then(r => r.data);
export const updateUser = (id, payload) => http.put(apiUrl(`/api/users/${id}`), payload).then(r => r.data);
export const deleteUser = (id) => http.delete(apiUrl(`/api/users/${id}`)).then(r => r.data);
export const setUserRole = (id, role) => http.patch(apiUrl(`/api/users/${id}/role`), { role }).then(r => r.data);
export const setUserStatus = (id, status) => http.patch(apiUrl(`/api/users/${id}/status`), { status }).then(r => r.data);