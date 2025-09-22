import http from './http.js';
import { apiUrl } from '../config/env.js';

export const listMenu = (params) => http.get(apiUrl('/api/menu'), { params }).then(r => r.data);
export const getDish = (id) => http.get(apiUrl(`/api/menu/${id}`)).then(r => r.data);