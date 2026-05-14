import axios from 'axios';
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';
export const UPLOADS_URL = BASE.replace('/api', '/uploads');
const api = axios.create({ baseURL: BASE, timeout: 30000 });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('cj_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) { localStorage.removeItem('cj_token'); localStorage.removeItem('cj_user'); }
  return Promise.reject(err);
});
export default api;
