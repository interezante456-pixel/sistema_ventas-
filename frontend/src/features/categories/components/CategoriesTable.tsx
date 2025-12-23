import { Edit, Trash2 } from 'lucide-react';

interface CategoriesTableProps {
    categories: any[];
    loading: boolean;
    onEdit: (category: any) => void;
    onDelete: (id: number) => void;
}

export const CategoriesTable = ({ categories, loading, onEdit, onDelete }: CategoriesTableProps) => {
    return (
        <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                <tr>
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Descripción</th>
                    <th className="px-6 py-3 text-center">Productos</th>
                    <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
                {loading ? (
                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">Cargando...</td></tr>
                ) : categories.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">No hay categorías registradas.</td></tr>
                ) : (
                    categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-800">{cat.nombre}</td>
                            <td className="px-6 py-4 text-gray-600">{cat.descripcion || '-'}</td>
                            <td className="px-6 py-4 text-center">
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold border">
                                    {cat._count?.productos || 0}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center flex justify-center gap-2">
                                <button
                                    onClick={() => onEdit(cat)}
                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(cat.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};
