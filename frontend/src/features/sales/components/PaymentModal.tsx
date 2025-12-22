import { useState, useEffect } from 'react';
import { X, CreditCard, User, FileText, Banknote, Wallet } from 'lucide-react';
import api from '../../../config/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (saleData: any) => void;
  total: number;
}

export const PaymentModal = ({ isOpen, onClose, onConfirm, total }: PaymentModalProps) => {
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [tipoComprobante, setTipoComprobante] = useState('BOLETA');
  const [clienteId, setClienteId] = useState<string>(''); // Vacío es "Cliente Genérico"
  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
        // Cargar clientes al abrir (podrías optimizarlo cargándolos fuera)
        api.get('/clients').then(res => setClientes(res.data)).catch(console.error);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onConfirm({
        metodoPago,
        tipoComprobante,
        clienteId: clienteId ? Number(clienteId) : null, // Si es string vacío, enviamos null
        montoPago: total // Por ahora asumimos pago exacto
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header con Total */}
        <div className="bg-blue-600 p-6 text-center text-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-blue-100 hover:text-white">
                <X size={24} />
            </button>
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Total a Pagar</p>
            <h2 className="text-4xl font-bold mt-1">S/ {total.toFixed(2)}</h2>
        </div>

        <div className="p-6 space-y-6">
            
            {/* Selección de Cliente */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} className="text-blue-600"/> Cliente
                </label>
                <select 
                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                >
                    <option value="">-- Cliente General (Público) --</option>
                    {clientes.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.nombres} {c.dniRuc ? `- ${c.dniRuc}` : ''}</option>
                    ))}
                </select>
            </div>

            {/* Tipo de Comprobante */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-blue-600"/> Comprobante
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {['BOLETA', 'FACTURA'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setTipoComprobante(type)}
                            className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                                tipoComprobante === type 
                                ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' 
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Método de Pago */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <CreditCard size={16} className="text-blue-600"/> Método de Pago
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: 'EFECTIVO', icon: Banknote, label: 'Efectivo' },
                        { id: 'TARJETA', icon: CreditCard, label: 'Tarjeta' },
                        { id: 'YAPE', icon: Wallet, label: 'Yape/Plin' },
                    ].map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setMetodoPago(method.id)}
                            className={`flex flex-col items-center justify-center gap-1 py-3 rounded-lg border transition-all ${
                                metodoPago === method.id 
                                ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500' 
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            <method.icon size={20} />
                            <span className="text-xs font-medium">{method.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Botón Pagar */}
            <button 
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <span className="text-lg">Confirmar Venta</span>
            </button>
        </div>
      </div>
    </div>
  );
};