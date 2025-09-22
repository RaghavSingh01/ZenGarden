import http from './http.js';
import { apiUrl } from '../config/env.js';

export const listInventory = (params = {}) => http.get(apiUrl('/api/inventory'), { params }).then(r => r.data);
export const getInventoryItem = (id) => http.get(apiUrl(`/api/inventory/${id}`)).then(r => r.data);
export const createInventoryItem = (payload) => http.post(apiUrl('/api/inventory'), payload).then(r => r.data);
export const updateInventoryItem = (id, payload) => http.put(apiUrl(`/api/inventory/${id}`), payload).then(r => r.data);
export const deleteInventoryItem = (id) => http.delete(apiUrl(`/api/inventory/${id}`)).then(r => r.data);