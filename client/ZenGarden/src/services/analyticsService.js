import http from './http.js';
import { apiUrl } from '../config/env.js';

export const fetchDailyRevenue = (params = {}) => http.get(apiUrl('/api/analytics/revenue/daily'), { params }).then(r => r.data);
export const fetchPopularDishes = (params = {}) => http.get(apiUrl('/api/analytics/popular-dishes'), { params }).then(r => r.data);
export const fetchOrderVolume = (params = {}) => http.get(apiUrl('/api/analytics/orders/volume'), { params }).then(r => r.data);
export const fetchKPIs = () => http.get(apiUrl('/api/analytics/kpis')).then(r => r.data);