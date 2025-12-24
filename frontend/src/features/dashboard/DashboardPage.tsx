import { useState } from "react";
import { StatsGrid } from "./components/StatsGrid";
import { RecentSalesTable } from "./components/RecentSalesTable";
import { QuickActions } from "./components/QuickActions";
import { SalesChart } from "./components/SalesChart";
import { TopProductsChart } from "./components/TopProductsChart";
import { TopClientsList } from "./components/TopClientsList";
import { LowStockModal } from "./components/LowStockModal";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "./hooks/useDashboardData";
import { getLowStockItems } from "./services/dashboard.service";

import { AccountantDashboard } from "./components/AccountantDashboard";
import { ReportCenter } from "./components/ReportCenter";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardData();

  // Recuperar usuario para validar rol
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isAccountant = user?.rol === 'CONTADOR';

  // Modal State
  const [isLowStockModalOpen, setIsLowStockModalOpen] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loadingLowStock, setLoadingLowStock] = useState(false);

  const handleLowStockClick = async () => {
    setIsLowStockModalOpen(true);
    setLoadingLowStock(true);
    try {
      const items = await getLowStockItems();
      setLowStockItems(items);
    } catch (error) {
      console.error("Error fetching low stock items:", error);
    } finally {
      setLoadingLowStock(false);
    }
  };

  const date = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedDate = date.charAt(0).toUpperCase() + date.slice(1);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-96 items-center justify-center flex-col gap-4">
        <p className="text-red-500 font-medium">{error || 'No se pudieron cargar los datos'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // 👇 VISTA ESPECIALIZADA PARA CONTADOR 👇
  if (isAccountant) {
    return <AccountantDashboard />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-gray-500 mt-1">{formattedDate}</p>
        </div>
      </div>

      <StatsGrid stats={data.stats} onLowStockClick={handleLowStockClick} />

      <LowStockModal
        isOpen={isLowStockModalOpen}
        onClose={() => setIsLowStockModalOpen(false)}
        products={lowStockItems}
        loading={loadingLowStock}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <SalesChart data={data.salesTrend} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TopProductsChart data={data.topProducts} />
        </div>
        <div className="lg:col-span-1">
          <TopClientsList clients={data.topClients} />
        </div>
        <div className="lg:col-span-1">
          <RecentSalesTable sales={data.recentSales} />
        </div>
      </div>

      {['SUPER_ADMIN', 'ADMIN'].includes(user?.rol) && (
        <ReportCenter />
      )}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">🚀 Aumenta tus ventas</h3>
            <p className="text-blue-100 mt-2 max-w-xl">
              ¿Sabías que los martes son tu mejor día de venta? Revisa el reporte detallado para optimizar tu stock.
            </p>
          </div>
          <button
            onClick={() => navigate('/sales')}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap">
            Ver Reportes
          </button>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
};