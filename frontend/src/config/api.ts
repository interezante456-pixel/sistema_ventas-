import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Asegúrate que coincida con tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Antes de enviar, poner el Token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;