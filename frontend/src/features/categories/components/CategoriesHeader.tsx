import { Plus } from 'lucide-react';

interface CategoriesHeaderProps {
    onNewCategory: () => void;
}

export const CategoriesHeader = ({ onNewCategory }: CategoriesHeaderProps) => {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
                <p className="text-gray-500">Organiza tus productos en grupos.</p>
            </div>
            <button
                onClick={onNewCategory}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 shadow-md transition-all active:scale-95"
            >
                <Plus size={20} /> Nueva Categoría
            </button>
        </div>
    );
};
