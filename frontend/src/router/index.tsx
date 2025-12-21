import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "../features/auth/LoginPage";
import DashboardLayout from "../layouts/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";

// Importaciones adaptadas a tu estructura "features/modulo/pages/..."
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { PosPage } from "../features/pos/pages/PosPage";         // <--- OJO AQUÍ
import { ProductsPage } from "../features/products/pages/ProductsPage"; // <--- OJO AQUÍ
import { SalesHistory } from "../features/sales/pages/SalesHistory";   // <--- OJO AQUÍ
// import { UsersPage } from "../features/users/pages/UsersPage"; // Descomenta cuando crees la carpeta users
import { UsersPage } from "../features/users/pages/UsersPage";


import { CategoriesPage } from '../features/categories/pages/CategoriesPage';

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          // Rutas hijas
          {
            path: "pos",         // Ruta: /pos
            element: <PosPage />,
          },
          {
            path: "products",    // Ruta: /products
            element: <ProductsPage />,
          },
          {
            path: "sales",       // Ruta: /sales (Historial)
            element: <SalesHistory />,
          },
          
           {
            path: "users",
          element: <UsersPage />,
          },
          {
            path: "categories",
            element: <CategoriesPage />,
          },
        ]
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  }
]);