import http from './http.js';
import { apiUrl } from '../config/env.js';

export const initiatePayment = (payload) => http.post(apiUrl('/api/payments/initiate'), payload).then(r => r.data);
export const verifyPayment = (payload) => http.post(apiUrl('/api/payments/verify'), payload).then(r => r.data);
export const getPaymentStatus = (orderId) => http.get(apiUrl(`/api/payments/status/${orderId}`)).then(r => r.data);