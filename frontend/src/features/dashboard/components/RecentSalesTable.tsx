interface Sale {
    id: string;
    client: string;
    amount: string;
    status: 'completed' | 'pending' | 'cancelled'; // or string if coming from API raw
    date: string;
}

interface RecentSalesTableProps {
    sales: Sale[];
}

const StatusBadge = ({ status }: { status: string }) => {
    const styles: { [key: string]: string } = {
        completed: "bg-green-100 text-green-700",
        completado: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        pendiente: "bg-yellow-100 text-yellow-700",
        cancelled: "bg-red-100 text-red-700",
        anulado: "bg-red-100 text-red-700",
    };

    const labels: { [key: string]: string } = {
        completed: "Completado",
        completado: "Completado",
        pending: "Pendiente",
        pendiente: "Pendiente",
        cancelled: "Anulado",
        anulado: "Anulado",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}>
            {labels[status] || status}
        </span>
    );
};

export const RecentSalesTable = ({ sales }: RecentSalesTableProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-lg">Ventas Recientes</h3>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline">
                    Ver todas
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Venta</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tiempo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{sale.client}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={sale.status} />
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.amount}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
