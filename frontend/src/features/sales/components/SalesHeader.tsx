
interface SalesHeaderProps {
    totalSales: number;
}

export const SalesHeader = ({ totalSales }: SalesHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Historial de Ventas</h1>
                <p className="text-gray-500">Consulta y gestiona las transacciones realizadas.</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Ventas Totales:</span>
                <span className="text-lg font-bold text-blue-600">{totalSales}</span>
            </div>
        </div>
    );
};
