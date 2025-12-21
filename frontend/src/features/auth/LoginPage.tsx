import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api'; // Importamos tu configuración de axios
import { useAuthStore } from '@/store/auth.store'; // Importamos el store

export const LoginPage = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  // Obtenemos la función para guardar el token del store (asumiendo que se llama setToken o login)
  // Si tu función en el store se llama diferente, cambia 'setToken' por el nombre correcto.
  const setAuthData = useAuthStore((state: any) => state.setToken); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Usamos la instancia 'api' que ya tiene la URL base (http://localhost:4000/api)
      const response = await api.post('/auth/login', {
        usuario,
        password
      });

      const { token, user } = response.data;
      
      // 1. Guardar en el Store de Zustand (para que el interceptor lo lea)
      if (setAuthData) {
        setAuthData(token); 
      }
      
      // 2. Guardar en LocalStorage (por si recargas la página)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // 3. Redirigir
      navigate('/');
      
    } catch (err: any) {
      console.error(err);
      // Manejo de error mejorado
      const errorMsg = err.response?.data?.message || 'Error al conectar con el servidor';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input 
              type="text" 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="******"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
              transition-colors`}
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}