import { FileSpreadsheet, TrendingUp, DollarSign, PieChart, Calendar, ChevronDown } from "lucide-react";
import { SalesChart } from "./SalesChart";
import { useDashboardData } from "../hooks/useDashboardData";
import { ReportCenter } from "./ReportCenter";
import { YearlySalesChart } from "./YearlySalesChart";

const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const YEARS = [2024, 2025, 2026];

export const AccountantDashboard = () => {
    const { data, loading, filters, setFilters } = useDashboardData();

    if (loading || !data) {
        return <div className="p-8 text-center text-gray-500">Cargando información financiera...</div>;
    }

    // Calcular valores financieros
    const ventasTotales = Number(data.stats.salesTotal) || 0;
    
    // Suponiendo régimen general o simplificado donde podemos estimar IGV de un Total.
    // Si el total incluye IGV: Base = Total / 1.18, IGV = Total - Base.
    // Si el total es Base: IGV = Total * 0.18.
    // * Asumamos que el backend envía Total Facturado (Bruto).
    const baseImponible = ventasTotales / 1.18;
    const igv = ventasTotales - baseImponible;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Panel Financiero</h1>
                    <p className="text-gray-500">Resumen contable y tributario</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    {/* Filtros de Fecha */}
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
                        <Calendar size={18} className="text-gray-400 ml-2" />
                        <select 
                            className="bg-transparent text-sm font-medium text-gray-700 py-1.5 focus:outline-none cursor-pointer"
                            value={filters.month}
                            onChange={(e) => setFilters({ ...filters, month: Number(e.target.value) })}
                        >
                            {MONTHS.map((m, i) => (
                                <option key={i} value={i}>{m}</option>
                            ))}
                        </select>
                        <div className="w-px h-4 bg-gray-200"></div>
                        <select 
                            className="bg-transparent text-sm font-medium text-gray-700 py-1.5 px-2 focus:outline-none cursor-pointer"
                            value={filters.year}
                            onChange={(e) => setFilters({ ...filters, year: Number(e.target.value) })}
                        >
                            {YEARS.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                        <TrendingUp size={16} />
                        TC: S/ 3.75
                    </div>
                </div>
            </div>

            {/* KPI CARDS FINANCIEROS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={64} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Facturado</p>
                        <h3 className="text-2xl font-bold text-gray-900">S/ {ventasTotales.toFixed(2)}</h3>
                        <div className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                            <span className="bg-green-100 px-2 py-0.5 rounded-full">Bruto</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Base Imponible</p>
                        <h3 className="text-2xl font-bold text-gray-900">S/ {baseImponible.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                     <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">IGV (18%)</p>
                        <h3 className="text-2xl font-bold text-gray-900">S/ {igv.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                     <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Comprobantes</p>
                        <h3 className="text-2xl font-bold text-gray-900">{data.stats.ordersCount}</h3>
                        <p className="text-xs text-gray-400 mt-1">Emitidos en el periodo</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                     <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Total Compras</p>
                        <h3 className="text-2xl font-bold text-red-600">- S/ {Number(data.stats.totalPurchases || 0).toFixed(2)}</h3>
                        <p className="text-xs text-gray-400 mt-1">Gastos en mercadería</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-green-50">
                     <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Ganancia Neta (Est.)</p>
                        <h3 className="text-2xl font-bold text-green-700">+ S/ {Number(data.stats.netProfit || 0).toFixed(2)}</h3>
                        <p className="text-xs text-gray-400 mt-1">Ventas - Costos</p>
                    </div>
                </div>
            </div>

            {/* GRÁFICO ANUAL (NUEVO) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <YearlySalesChart data={data.yearlySales} />
                </div>
                 <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                     <h3 className="font-bold text-gray-800 mb-6">Composición de Ventas</h3>
                     <div className="flex items-center justify-center h-64">
                        <div className="text-center text-gray-400">
                            <PieChart size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Gráfico de Métodos de Pago</p>
                            <p className="text-xs mt-1 text-gray-300">Próximamente</p>
                        </div>
                     </div>
                </div>
            </div>

            {/* CENTRO DE REPORTES */}
            <ReportCenter />

            {/* GRÁFICO DE TENDENCIA SEMANAL (SECUNDARIO) */}
            <div className="opacity-75">
                <SalesChart data={data.salesTrend} />
            </div>
        </div>
    );
};
