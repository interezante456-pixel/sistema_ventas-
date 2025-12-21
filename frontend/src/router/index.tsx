import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import PosPage from '@/features/pos/pages/PosPage'; // Ahora sí lo encontrará

// Componentes temporales
const Login = () => <div className="h-screen flex items-center justify-center text-2xl font-bold">Login (Próximamente)</div>;
const Products = () => <div className="p-10 text-xl text-gray-500">Gestión de Productos + Imágenes</div>;
const Users = () => <div className="p-10 text-xl text-gray-500">Gestión de Usuarios</div>;

export const router = createBrowserRouter([
  { // 👈 TE FALTABA ESTA LLAVE
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/pos" replace /> },
      { path: 'pos', element: <PosPage /> },
      { path: 'products', element: <Products /> },
      { path: 'users', element: <Users /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);