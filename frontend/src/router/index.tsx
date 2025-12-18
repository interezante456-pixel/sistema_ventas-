import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('@/pages/Home'))
const Products = lazy(() => import('@/features/products/components/ProductList'))
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'))

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardLayout>
                <Home />
              </DashboardLayout>
            }
          />
          <Route
            path="/products"
            element={
              <DashboardLayout>
                <Products />
              </DashboardLayout>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
