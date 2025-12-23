import { X } from 'lucide-react';

interface Product {
    id: number;
    codigo: string;
    nombre: string;
    stock: number;
    precioVenta: number;
    categoria: {
        nombre: string;
    };
}

interface LowStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    loading: boolean;
}

export const LowStockModal = ({ isOpen, onClose, products, loading }: LowStockModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Productos con Stock Bajo</h3>
                        <p className="text-sm text-gray-500">Items que requieren reposición inmediata</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-0 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No hay productos con stock bajo.
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Producto</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Categoría</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Stock</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Precio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-amber-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{product.nombre}</div>
                                            <div className="text-xs text-gray-500">Cod: {product.codigo}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                                {product.categoria.nombre}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-bold ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-right">
                                            S/ {Number(product.precioVenta).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                    >
                        Cerrar
                    </button>
                    <button className="ml-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium text-sm shadow-sm shadow-amber-200">
                        Generar Orden de Compra
                    </button>
                </div>
            </div>
        </div>
    );
};
