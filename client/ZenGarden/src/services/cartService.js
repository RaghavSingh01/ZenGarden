// src/services/cartService.js
import http from './http.js';
import { apiUrl } from '../config/env.js';

// Server cart endpoints (if backend supports server-managed carts)
export const getMyCart = (params = {}) =>
  http.get(apiUrl('/api/cart/my'), { params }).then(r => r.data);

export const setCart = (items = []) =>
  http.put(apiUrl('/api/cart'), { items }).then(r => r.data);

export const addItem = (itemId, quantity = 1) =>
  http.post(apiUrl('/api/cart/items'), { itemId, quantity }).then(r => r.data);

export const updateItem = (itemId, quantity) =>
  http.patch(apiUrl(`/api/cart/items/${itemId}`), { quantity }).then(r => r.data);

export const removeItem = (itemId) =>
  http.delete(apiUrl(`/api/cart/items/${itemId}`)).then(r => r.data);

export const clearServerCart = () =>
  http.delete(apiUrl('/api/cart')).then(r => r.data);

// Place an order from current cart payload (checkout)
export const placeOrder = (payload) =>
  http.post(apiUrl('/api/orders'), payload).then(r => r.data);

// Optional: coupons and totals
export const applyCoupon = (code) =>
  http.post(apiUrl('/api/cart/coupons'), { code }).then(r => r.data);

export const removeCoupon = (code) =>
  http.delete(apiUrl(`/api/cart/coupons/${encodeURIComponent(code)}`)).then(r => r.data);

export const getCartTotals = () =>
  http.get(apiUrl('/api/cart/totals')).then(r => r.data);