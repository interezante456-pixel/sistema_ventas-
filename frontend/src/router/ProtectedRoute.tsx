import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  // Buscamos el token en el almacenamiento local
  const token = localStorage.getItem('token');

  // Si NO hay token, redirigir al Login inmediatamente
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si SÍ hay token, dejamos pasar al usuario (renderiza el contenido hijo)
  return <Outlet />;
};