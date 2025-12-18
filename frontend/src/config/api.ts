import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Ejemplo de interceptor (autenticación / refresh token)
api.interceptors.request.use((config) => {
  // const token = getAuthToken()
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
