import { useEffect, useState } from "react";
import { Package, AlertTriangle, ArrowRightLeft, DollarSign, TrendingUp, TrendingDown, ClipboardList } from "lucide-react";
import { getWarehouseDashboardData, type WarehouseData } from "../services/dashboard.service";
import { StockMovementChart, CategoryDistributionChart } from "./WarehouseCharts";

export const WarehouseDashboard = () => {
    const [data, setData] = useState<WarehouseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await getWarehouseDashboardData();
                setData(result);
            } catch (err: any) {
                setError(err.message || 'Error al cargar datos de almacén');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando almacén...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!data) return null;

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Panel de Almacén</h2>
                    <p className="text-slate-500">Gestión de inventario y movimientos</p>
                </div>
                <div className="bg-slate-100 px-4 py-2 rounded-lg text-slate-600 font-medium text-sm flex items-center gap-2">
                    <ClipboardList size={18} />
                    Inventario en Tiempo Real
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-indigo-100 font-medium text-sm">Total Productos</p>
                        <h3 className="text-3xl font-bold mt-1">{data.totalProducts}</h3>
                        <p className="text-xs text-indigo-200 mt-2">Items registrados</p>
                    </div>
                    <Package className="absolute right-4 bottom-4 text-indigo-400 opacity-30 w-16 h-16" />
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                     <div className="relative z-10">
                        <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">Valor Inventario</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">S/ {data.totalValue.toFixed(2)}</h3>
                        <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                             <TrendingUp size={14} /> Costo Estimado
                        </p>
                    </div>
                     <DollarSign className="absolute right-4 top-4 text-green-500 opacity-20 w-8 h-8" />
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                     <div className="relative z-10">
                        <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">Stock Crítico</p>
                        <h3 className="text-2xl font-bold text-red-600 mt-1">{data.criticalStock}</h3>
                        <p className="text-xs text-slate-400 mt-2">Productos con stock ≤ 5</p>
                    </div>
                    <AlertTriangle className="absolute right-4 top-4 text-red-500 opacity-20 w-8 h-8" />
                </div>
                
                 <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                     <div className="relative z-10">
                        <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">Movimientos Hoy</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{data.movementsToday}</h3>
                        <p className="text-xs text-slate-400 mt-2">Entradas y Salidas</p>
                    </div>
                    <ArrowRightLeft className="absolute right-4 top-4 text-blue-500 opacity-20 w-8 h-8" />
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <StockMovementChart data={data.movementsTrend} />
                </div>
                <div className="lg:col-span-1 h-full">
                    <CategoryDistributionChart data={data.categoryStats} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Movements Table */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Movimientos Recientes</h3>
                        <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">Ver kardex completo</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Producto</th>
                                    <th className="px-6 py-3">Tipo</th>
                                    <th className="px-6 py-3">Cantidad</th>
                                    <th className="px-6 py-3">Motivo</th>
                                    <th className="px-6 py-3">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.recentMovements.map((m) => (
                                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-700">{m.product}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                m.type === 'ENTRADA' 
                                                ? 'bg-emerald-100 text-emerald-700' 
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {m.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-700">{m.quantity}</td>
                                        <td className="px-6 py-4 text-slate-500 truncate max-w-[150px]" title={m.reason}>{m.reason}</td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(m.date).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                                {data.recentMovements.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                            No hay movimientos recientes
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stock Distribution / Quick Actions */}
                <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Acciones Rápidas</h3>
                        <p className="text-slate-400 text-sm mb-6">Gestiona tu inventario con accesos directos.</p>
                        
                        <div className="space-y-3">
                            <button className="w-full py-3 px-4 bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                                <TrendingUp size={18} />
                                Registrar Entrada
                            </button>
                            <button className="w-full py-3 px-4 bg-slate-800 rounded-lg font-medium hover:bg-slate-700 transition flex items-center justify-center gap-2 border border-slate-700">
                                <TrendingDown size={18} />
                                Registrar Salida
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                <DollarSign size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-emerald-400 font-medium">Consejo</p>
                                <p className="text-xs text-slate-400 mt-0.5">Mantén tu stock crítico bajo 10 items para evitar pérdida de ventas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
