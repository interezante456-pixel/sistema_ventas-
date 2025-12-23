import { Plus } from 'lucide-react';

interface ProductsHeaderProps {
    onNewProduct: () => void;
}

export const ProductsHeader = ({ onNewProduct }: ProductsHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Inventario de Productos</h1>
                <p className="text-gray-500">Gestiona tu catálogo y stock.</p>
            </div>
            <button
                onClick={onNewProduct}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
            >
                <Plus size={20} /> Nuevo Producto
            </button>
        </div>
    );
};
