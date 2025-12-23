import { Edit, Trash2, Eye, RefreshCw, Activity, Package } from 'lucide-react';

interface ProductsTableProps {
    products: any[];
    loading: boolean;
    onEdit: (product: any) => void;
    onDelete: (product: any) => void;
    onView: (product: any) => void;
}

export const ProductsTable = ({ products, loading, onEdit, onDelete, onView }: ProductsTableProps) => {
    return (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
             {/* Note: The parent container might already have the border/shadow, but typically the table is inside a card. 
                 Since we split Filters and Table, let's make sure the visual hierarchy is consistent.
                 In the original code, the filter was IN the same card header as the table.
                 To maintain exact visual, we might want to combine them or just keep the table part here.
                 Let's assume the previous Filters component renders the top part, and this one renders the table part.
                 Wait, in original code it was one big div.
                 Let's make this component just the table part, but wrapping it in a div might double the border if not careful.
                 For this refactor, I'll make the Table component responsible for the table responsiveness wrapper.
             */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                        <tr>
                            <th className="px-6 py-3">Código</th>
                            <th className="px-6 py-3">Producto</th>
                            <th className="px-6 py-3">Categoría</th>
                            <th className="px-6 py-3 text-right">Precio Venta</th>
                            <th className="px-6 py-3 text-center">Stock</th>
                            <th className="px-6 py-3 text-center">Estado</th>
                            <th className="px-6 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {loading ? (
                            <tr><td colSpan={7} className="text-center py-8 text-gray-500">Cargando...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-8 text-gray-500">No hay productos.</td></tr>
                        ) : (
                            products.map((product) => (
                                <tr
                                    key={product.id}
                                    className={`transition-colors group border-b last:border-none ${!product.estado ? 'bg-gray-100/80 grayscale-[0.8]' : 'hover:bg-gray-50'}`}
                                >
                                    <td className="px-6 py-4 font-mono text-gray-600">{product.codigo}</td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                {product.imagenUrl ? (
                                                    <img src={product.imagenUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package size={16} className="text-gray-400" />
                                                )}
                                            </div>
                                            <span className={`font-medium ${!product.estado ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                                {product.nombre}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                                            {product.categoria?.nombre || 'Sin Cat.'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-700">
                                        S/ {Number(product.precioVenta).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock <= 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {product.stock} un.
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border
                            ${product.estado
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-red-50 text-red-700 border-red-200"
                                            }`}>
                                            <Activity size={12} />
                                            {product.estado ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => onView(product)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                title="Ver detalle"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            <button
                                                onClick={() => onEdit(product)}
                                                className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>

                                            <button
                                                onClick={() => onDelete(product)}
                                                className={`p-2 rounded-lg ${!product.estado ? "text-green-600 hover:bg-green-50" : "text-gray-500 hover:text-red-600 hover:bg-red-50"}`}
                                                title={!product.estado ? "Restaurar" : "Eliminar"}
                                            >
                                                {!product.estado ? <RefreshCw size={18} /> : <Trash2 size={18} />}
                                            </button>
                                        </div>
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
