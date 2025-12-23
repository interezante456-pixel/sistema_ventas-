import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import type { ReactNode } from 'react'; // 👈 AGREGAMOS "type" AQUÍ

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Usamos !!state.token para verificar si existe el token (true/false)
  const isAuth = useAuthStore(state => !!state.token); 

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};