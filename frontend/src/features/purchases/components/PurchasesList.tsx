import { Plus, Calendar, User, Package } from 'lucide-react';
import type { Purchase } from '../services/purchases.service';

interface PurchasesListProps {
    purchases: Purchase[];
    onNewPurchase: () => void;
}

export const PurchasesList = ({ purchases, onNewPurchase }: PurchasesListProps) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Compras e Ingresos</h1>
                    <p className="text-gray-500">Historial de abastecimiento de mercadería</p>
                </div>
                <button 
                    onClick={onNewPurchase}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                    <Plus size={20} />
                    Nueva Compra
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">ID</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Fecha</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Proveedor</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Realizado por</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Total</th>
                                {/* <th className="px-6 py-4 font-semibold text-gray-700 text-right">Acciones</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {purchases.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <Package size={48} className="text-gray-300" />
                                            <p>No se han registrado compras aún.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                purchases.map((purchase) => (
                                    <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-600">
                                            #{purchase.id.toString().padStart(4, '0')}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(purchase.fechaCompra).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {purchase.proveedor?.nombre || 'Proveedor Eliminado'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-gray-400" />
                                                {purchase.usuario?.nombre || 'Admin'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                                            S/ {Number(purchase.total).toFixed(2)}
                                        </td>
                                        {/* <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Eye size={18} />
                                            </button>
                                        </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
