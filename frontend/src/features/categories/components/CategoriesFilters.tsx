import { Search } from 'lucide-react';

interface CategoriesFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export const CategoriesFilters = ({ searchTerm, setSearchTerm }: CategoriesFiltersProps) => {
    return (
        <div className="p-4 border-b bg-gray-50">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Buscar categoría..."
                    className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );
};
