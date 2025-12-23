import { Eye } from 'lucide-react';

interface SalesTableProps {
    sales: any[];
    loading: boolean;
    onViewDetail: (sale: any) => void;
}

export const SalesTable = ({ sales, loading, onViewDetail }: SalesTableProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4 font-bold"># ID</th>
                            <th className="p-4 font-bold">Fecha</th>
                            <th className="p-4 font-bold">Vendedor</th>
                            <th className="p-4 font-bold">Cliente</th>
                            <th className="p-4 font-bold">Tipo</th>
                            <th className="p-4 font-bold">Pago</th>
                            <th className="p-4 font-bold text-right">Total</th>
                            <th className="p-4 font-bold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={8} className="p-8 text-center text-gray-500">Cargando historial...</td></tr>
                        ) : sales.length === 0 ? (
                            <tr><td colSpan={8} className="p-8 text-center text-gray-500">No se encontraron ventas.</td></tr>
                        ) : (
                            sales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">#{sale.id}</td>
                                    <td className="p-4 text-gray-600 text-sm">
                                        {new Date(sale.fechaVenta).toLocaleDateString()} <br />
                                        <span className="text-xs text-gray-400">{new Date(sale.fechaVenta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </td>
                                    <td className="p-4 text-gray-700 text-sm">
                                        {sale.usuario?.nombre || <span className="text-gray-400">Desconocido</span>}
                                    </td>
                                    <td className="p-4 text-gray-800 font-medium">
                                        {sale.cliente ? sale.cliente.nombres : <span className="text-gray-400 italic">Público General</span>}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${sale.tipoComprobante === 'FACTURA' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                            {sale.tipoComprobante}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{sale.metodoPago}</td>
                                    <td className="p-4 text-right font-bold text-gray-900">
                                        S/ {Number(sale.total).toFixed(2)}
                                    </td>
                                    <td className="p-4 flex justify-center">
                                        <button
                                            onClick={() => onViewDetail(sale)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Ver Detalles"
                                        >
                                            <Eye size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
