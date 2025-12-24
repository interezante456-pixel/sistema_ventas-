import { useState, useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import { KardexTable } from '../components/KardexTable';
import { StockAdjustmentModal } from '../components/StockAdjustmentModal';
import { ClipboardList, Filter } from 'lucide-react';
import { useProducts } from '../../products/hooks/useProducts';

export const InventoryPage = () => {
    const { movements, loading, refresh, registerAdjustment } = useInventory();
    const { products } = useProducts();
    
    // Filters State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [type, setType] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Debounce or direct call
        const filters: any = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (selectedProduct) filters.productoId = Number(selectedProduct);
        if (type) filters.tipo = type;

        refresh(filters);
    }, [startDate, endDate, selectedProduct, type, refresh]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kardex de Inventario</h1>
                    <p className="text-gray-500">Historial de movimientos y ajustes de stock</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                    >
                        <ClipboardList size={20} />
                        Ajuste Manual
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-3 text-gray-700 font-medium">
                    <Filter size={18} /> Filtros de Búsqueda
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
                        <input 
                            type="date" 
                            className="w-full border rounded-lg p-2 text-sm"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
                        <input 
                            type="date" 
                            className="w-full border rounded-lg p-2 text-sm"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Producto</label>
                        <select 
                            className="w-full border rounded-lg p-2 text-sm"
                            value={selectedProduct}
                            onChange={e => setSelectedProduct(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tipo Mov.</label>
                        <select 
                            className="w-full border rounded-lg p-2 text-sm"
                            value={type}
                            onChange={e => setType(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="ENTRADA">Entradas (+)</option>
                            <option value="SALIDA">Salidas (-)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            {loading && movements.length === 0 ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <KardexTable movements={movements} />
            )}

            <StockAdjustmentModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSuccess={registerAdjustment}
            />
        </div>
    );
};
