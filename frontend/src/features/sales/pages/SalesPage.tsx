import { useState } from 'react';
import { SaleDetailModal } from '../components/SaleDetailModal';
import { SalesHeader } from '../components/SalesHeader';
import { SalesFilters } from '../components/SalesFilters';
import { SalesTable } from '../components/SalesTable';
import { useSales } from '../hooks/useSales';
import { useSalesExport } from '../hooks/useSalesExport';

export const SalesPage = () => {
    // Hooks personalizados para lógica de negocio
    const { 
        filteredSales, 
        loading, 
        searchTerm, 
        setSearchTerm, 
        dateFilter, 
        setDateFilter 
    } = useSales();

    const { exportToExcel, exportToPDF } = useSalesExport(filteredSales);

    // Estado local para UI (Modal)
    const [selectedSale, setSelectedSale] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenDetail = (sale: any) => {
        setSelectedSale(sale);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            
            {/* Cabecera */}
            <SalesHeader totalSales={filteredSales.length} />

            {/* Filtros y Exportación */}
            <SalesFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                onExportExcel={exportToExcel}
                onExportPDF={exportToPDF}
            />

            {/* Tabla de Resultados */}
            <SalesTable
                sales={filteredSales}
                loading={loading}
                onViewDetail={handleOpenDetail}
            />

            {/* Modal de Detalle */}
            <SaleDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sale={selectedSale}
            />

        </div>
    );
};