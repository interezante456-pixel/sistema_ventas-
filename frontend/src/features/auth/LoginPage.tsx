import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { useAuthStore } from '@/store/auth.store';

export const LoginPage = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Accedemos a la acción del store para guardar el token en memoria
  const setToken = useAuthStore((state: any) => state.setToken); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        usuario,
        password
      });

      // Asegúrate que tu backend devuelva { token: "...", user: { nombre: "...", rol: "..." } }
      const { token, user } = response.data;
      
      console.log("Login exitoso. Datos usuario:", user); // 👈 Verifica aquí si sale el "nombre"

      // 1. Guardar en el Store de Zustand (Estado global de la app)
      if (setToken) {
        setToken(token); 
      }
      
      // 2. Guardar en LocalStorage (Persistencia y para leerlo en el Header)
      localStorage.setItem('token', token);
      
      // 👇 ESTA LÍNEA ES LA CLAVE PARA EL HEADER:
      // Guardamos todo el objeto usuario como texto.
      localStorage.setItem('user', JSON.stringify(user));
      
      // 3. Redirigir al Dashboard
      navigate('/');
      
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Error al conectar con el servidor';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-200">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Sistema Ventas</h2>
            <p className="text-gray-500 text-sm">Ingresa tus credenciales</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 text-sm shadow-sm">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Usuario</label>
            <input 
              type="text" 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Ej: admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="******"
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white 
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'} 
              transition-all transform active:scale-95`}
          >
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};