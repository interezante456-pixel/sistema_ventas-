import { Search } from 'lucide-react';

interface ClientsFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export const ClientsFilters = ({ searchTerm, setSearchTerm }: ClientsFiltersProps) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre o DNI/RUC..."
                    className="pl-10 w-full border border-gray-300 rounded-lg py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );
};
