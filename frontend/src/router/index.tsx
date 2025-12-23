import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { UsersPage } from '../features/users/pages/UsersPage';
import { CategoriesPage } from '../features/categories/pages/CategoriesPage';
import { ProductsPage } from '../features/products/pages/ProductsPage';
import { PosPage } from '../features/pos/pages/PosPage';
import { SalesPage } from '../features/sales/pages/SalesPage';
import { ClientsPage } from '../features/clients/pages/ClientsPage'; // 👈 IMPORTAR ESTO

import  {ProtectedRoute}  from '../router/ProtectedRoute';
import DashboardLayout  from '../layouts/DashboardLayout';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'users', element: <UsersPage /> },
      
      // 👇 AGREGAR ESTA RUTA NUEVA
      { path: 'clients', element: <ClientsPage /> },
      
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'pos', element: <PosPage /> },
      { path: 'sales', element: <SalesPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);