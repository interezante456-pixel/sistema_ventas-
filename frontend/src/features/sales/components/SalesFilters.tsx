import { Search, Calendar, FileDown, FileSpreadsheet, FileText } from 'lucide-react';
import { useState } from 'react';

interface SalesFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    dateFilter: string;
    setDateFilter: (value: string) => void;
    onExportExcel: () => void;
    onExportPDF: () => void;
}

export const SalesFilters = ({ 
    searchTerm, 
    setSearchTerm, 
    dateFilter, 
    setDateFilter,
    onExportExcel,
    onExportPDF 
}: SalesFiltersProps) => {
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Click handler for the container to close menu when clicking outside (handled in parent or using a ref would be better, but keeping simple for now)
    // Actually, in the original code, the parent div had the onClick.
    // For better modularity, we can handle the close behavior locally with a backdrop or just use the button toggle.
    // Let's keep existing logic: The export menu is relative to the button.
    
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 z-10 relative">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por cliente o N° venta..."
                    className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                    type="date"
                    className="pl-10 border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                />
            </div>

            {/* BOTÓN EXPORTAR CON MENÚ DESPLEGABLE */}
            <div className="relative">
                <button
                    onClick={(e) => {
                        e.stopPropagation(); 
                        setShowExportMenu(!showExportMenu);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    <FileDown size={20} /> Exportar
                </button>

                {showExportMenu && (
                    <>
                         {/* Invisible backdrop to close menu when clicking outside */}
                         <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setShowExportMenu(false)}
                         />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                            <button
                                onClick={() => {
                                    onExportExcel();
                                    setShowExportMenu(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors text-left"
                            >
                                <FileSpreadsheet size={18} className="text-green-600" /> Excel (CSV)
                            </button>
                            <button
                                onClick={() => {
                                    onExportPDF();
                                    setShowExportMenu(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors text-left border-t border-gray-50"
                            >
                                <FileText size={18} className="text-red-600" /> Documento PDF
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
