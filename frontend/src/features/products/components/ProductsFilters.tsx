import { Search } from 'lucide-react';

interface ProductsFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

export const ProductsFilters = ({ searchTerm, setSearchTerm }: ProductsFiltersProps) => {
    return (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o código..."
                        className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};
