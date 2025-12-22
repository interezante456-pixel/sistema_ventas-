import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Interceptor: Antes de enviar la petición...
api.interceptors.request.use((config) => {
  // 1. Intentamos obtener el token del Store (Memoria)
  let token = useAuthStore.getState().token;

  // 2. Si NO hay token en el Store, lo buscamos en el LocalStorage (Navegador)
  // (Esto arregla el error 401 al recargar la página)
  if (!token) {
    token = localStorage.getItem('token');
  }

  // 3. Si encontramos un token, lo pegamos en la cabecera
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;