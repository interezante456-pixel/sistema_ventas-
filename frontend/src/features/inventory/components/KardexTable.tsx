import type { StockMovement } from '../services/inventory.service';
import { ArrowUpRight, ArrowDownLeft, Calendar, Package } from 'lucide-react';

interface KardexTableProps {
    movements: StockMovement[];
}

export const KardexTable = ({ movements }: KardexTableProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Fecha</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Producto</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Tipo</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Cantidad</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Motivo / Detalle</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {movements.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-3">
                                        <Package size={48} className="text-gray-300" />
                                        <p>No hay movimientos registrados en este periodo.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            movements.map((mov) => (
                                <tr key={mov.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            {new Date(mov.fecha).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {mov.producto?.imagenUrl ? (
                                                <img 
                                                    src={mov.producto.imagenUrl} 
                                                    alt={mov.producto.nombre} 
                                                    className="w-8 h-8 rounded object-cover border"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <Package size={14} />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{mov.producto?.nombre}</p>
                                                <p className="text-xs text-gray-500">{mov.producto?.codigo}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {mov.tipo === 'ENTRADA' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <ArrowUpRight size={12} /> Entrada
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <ArrowDownLeft size={12} /> Salida
                                            </span>
                                        )}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${mov.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                                        {mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.cantidad}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {mov.motivo || '-'}
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
