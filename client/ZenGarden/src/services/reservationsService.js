import http from './http.js';
import { apiUrl } from '../config/env.js';

// User
export const listMyReservations = (params = {}) => http.get(apiUrl('/api/reservations/myReservations'), { params }).then(r => r.data);
export const createReservation = (payload) => http.post(apiUrl('/api/reservations'), payload).then(r => r.data);
export const cancelReservation = (id) => http.delete(apiUrl(`/api/reservations/${id}`)).then(r => r.data);

// Admin/Chef
export const listAllReservations = (params = {}) => http.get(apiUrl('/api/reservations'), { params }).then(r => r.data);
export const confirmReservation = (id) => http.patch(apiUrl(`/api/reservations/${id}/confirm`)).then(r => r.data);
export const completeReservation = (id) => http.patch(apiUrl(`/api/reservations/${id}/complete`)).then(r => r.data);

// Availability
export const getAvailableSlots = (date) => http.get(apiUrl('/api/reservations/slots'), { params: { date } }).then(r => r.data);