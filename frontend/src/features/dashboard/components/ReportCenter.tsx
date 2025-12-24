import { FileSpreadsheet, Package, TrendingUp, Download } from "lucide-react";
import { ReportButton } from "./ReportButton";
import { downloadSalesRegister, downloadInventoryValuation, downloadBalanceSheet } from "../services/dashboard.service";

export const ReportCenter = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
    );
};
