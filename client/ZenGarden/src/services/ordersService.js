import http from './http.js';
import { apiUrl } from '../config/env.js';

// User
export const listMyOrders = (params = {}) =>
  http.get(apiUrl('/api/orders/my'), { params }).then(r => r.data);

export const getOrder = (id, config = {}) =>
  http.get(apiUrl(`/api/orders/${id}`), config).then(r => r.data);

export const cancelOrder = (id) =>
  http.patch(apiUrl(`/api/orders/${id}/cancel`)).then(r => r.data);

export const reorder = (id) =>
  http.post(apiUrl(`/api/orders/${id}/reorder`)).then(r => r.data);

// Staff (optional)
export const listAllOrders = (params = {}) =>
  http.get(apiUrl('/api/orders'), { params }).then(r => r.data);