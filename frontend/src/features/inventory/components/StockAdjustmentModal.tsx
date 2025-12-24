import { useState } from 'react';
import { X, Save, ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-react';
import { useProducts } from '../../products/hooks/useProducts';

interface StockAdjustmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: any) => Promise<any>; // Receive the registerAdjustment function
}

export const StockAdjustmentModal = ({ isOpen, onClose, onSuccess }: StockAdjustmentModalProps) => {
    const { products } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
    const [type, setType] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA'); // Entrada is Adjustment +, Salida is Adjustment -
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct || !quantity || !reason) return;

        setLoading(true);
        const result = await onSuccess({
            productoId: Number(selectedProduct),
            tipo: type,
            cantidad: Number(quantity),
            motivo: reason
        });
        setLoading(false);

        if (result.success) {
            onClose();
            // Reset form
            setSelectedProduct('');
            setQuantity('');
            setReason('');
        } else {
            alert(result.error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95">
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <AlertTriangle className="text-orange-500" size={20} /> Ajuste de Inventario
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Producto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                        <select 
                            className="w-full border rounded-lg p-2 text-sm"
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(Number(e.target.value))}
                            required
                        >
                            <option value="">-- Seleccionar Producto --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.codigo} - {p.nombre} (Stock: {p.stock})</option>
                            ))}
                        </select>
                    </div>

                    {/* Tipo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Ajuste</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setType('ENTRADA')}
                                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                                    type === 'ENTRADA' 
                                    ? 'bg-green-50 border-green-200 text-green-700 ring-2 ring-green-500 ring-offset-1' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <ArrowUpRight size={16} /> Ingreso (+)
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('SALIDA')}
                                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                                    type === 'SALIDA' 
                                    ? 'bg-red-50 border-red-200 text-red-700 ring-2 ring-red-500 ring-offset-1' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <ArrowDownLeft size={16} /> Salida (-)
                            </button>
                        </div>
                    </div>

                    {/* Cantidad y Motivo */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                            <input 
                                type="number" 
                                min="1"
                                className="w-full border rounded-lg p-2 text-sm"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="0"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                            <input 
                                type="text"
                                className="w-full border rounded-lg p-2 text-sm"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Ej: Rotura, Vencimiento..."
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancelar</button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className={`px-4 py-2 text-white rounded-lg shadow-md text-sm font-medium flex items-center gap-2 ${
                                type === 'ENTRADA' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            <Save size={16} /> {loading ? 'Procesando...' : 'Aplicar Ajuste'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};
