import { FileSpreadsheet, TrendingUp, DollarSign, PieChart, Download, Package } from "lucide-react";
import { ReportButton } from "./ReportButton";
import { SalesChart } from "./SalesChart";
import { useDashboardData } from "../hooks/useDashboardData";
import { downloadSalesRegister, downloadInventoryValuation, downloadBalanceSheet } from "../services/dashboard.service";

export const AccountantDashboard = () => {
    const { data, loading } = useDashboardData();

    if (loading || !data) {
        return <div className="p-8 text-center text-gray-500">Cargando información financiera...</div>;
    }

    // Aseguramos que sea número (el servicio lo define como number)
    const ventasTotales = Number(data.stats.salesToday) || 0;

    const igv = ventasTotales * 0.18;
    const neto = ventasTotales; // Asumiendo que lo que viene es neto, o si es bruto ajustar calculo.
    const bruto = neto + igv;

    // Nota: financialStats no se usaba, lo eliminamos.

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Panel Financiero</h1>
                    <p className="text-gray-500">Resumen contable y tributario</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                    <TrendingUp size={16} />
                    Tipo de Cambio (Ref): S/ 3.75
                </div>
            </div>

            {/* KPI CARDS FINANCIEROS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Ventas Netas (Mes)</p>
                            <h3 className="text-2xl font-bold text-gray-900">S/ {neto.toFixed(2)}</h3> 
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <PieChart size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">IGV (18%)</p>
                            <h3 className="text-2xl font-bold text-gray-900">S/ {igv.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Facturado</p>
                            <h3 className="text-2xl font-bold text-gray-900">S/ {bruto.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Comprobantes</p>
                            <h3 className="text-2xl font-bold text-gray-900">{data.stats.ordersToday}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* CENTRO DE REPORTES */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Download size={20} className="text-gray-400" />
                    Centro de Reportes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ReportButton 
                        title="Registro de Ventas" 
                        description="Formato 14.1 para SUNAT (Excel)"
                        icon={FileSpreadsheet}
                        color="bg-green-500"
                        onClick={() => downloadSalesRegister()}
                    />
                    <ReportButton 
                        title="Inventario Valorizado" 
                        description="Costo total de mercadería actual"
                        icon={Package} 
                        color="bg-blue-500"
                        onClick={() => downloadInventoryValuation()}
                    />
                     <ReportButton 
                        title="Balance de Comprobación" 
                        description="Resumen de movimientos del mes"
                        icon={TrendingUp}
                        color="bg-purple-500"
                        onClick={() => downloadBalanceSheet()}
                    />
                </div>
            </div>

            {/* GRÁFICO DE TENDENCIA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SalesChart data={data.salesTrend} />
                </div>
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                     <h3 className="font-bold text-gray-800 mb-6">Composición de Ventas</h3>
                     <div className="flex items-center justify-center h-64">
                        <div className="text-center text-gray-400">
                            <PieChart size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Gráfico de Métodos de Pago</p>
                            <p className="text-xs">(Próximamente)</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};
