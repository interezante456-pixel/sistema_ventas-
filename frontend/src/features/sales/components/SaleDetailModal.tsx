import { X, Package, Calendar, User, CreditCard, FileText } from 'lucide-react';

interface SaleDetailModalProps {
  sale: any;
  isOpen: boolean;
  onClose: () => void;
}

export const SaleDetailModal = ({ sale, isOpen, onClose }: SaleDetailModalProps) => {
  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header - Tipo Ticket */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-start">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="text-blue-400"/> Detalle de Venta #{sale.id}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                    {new Date(sale.fecha).toLocaleString()}
                </p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-full transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Info Resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
            <div>
                <span className="text-xs text-gray-500 font-bold uppercase">Cliente</span>
                <div className="flex items-center gap-2 mt-1">
                    <User size={16} className="text-blue-600"/>
                    <span className="font-medium text-gray-900">{sale.cliente?.nombres || 'Cliente Genérico'}</span>
                </div>
            </div>
            <div>
                <span className="text-xs text-gray-500 font-bold uppercase">Comprobante</span>
                <p className="font-medium text-gray-900 mt-1">{sale.tipoComprobante}</p>
            </div>
            <div>
                <span className="text-xs text-gray-500 font-bold uppercase">Pago</span>
                <div className="flex items-center gap-2 mt-1">
                    <CreditCard size={16} className="text-green-600"/>
                    <span className="font-medium text-gray-900">{sale.metodoPago}</span>
                </div>
            </div>
            <div>
                <span className="text-xs text-gray-500 font-bold uppercase">Estado</span>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${
                    sale.estado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {sale.estado ? 'COMPLETADO' : 'ANULADO'}
                </span>
            </div>
        </div>

        {/* Tabla de Productos */}
        <div className="p-6 overflow-y-auto max-h-[40vh]">
            <table className="w-full text-sm text-left">
                <thead className="text-gray-500 font-bold border-b">
                    <tr>
                        <th className="py-2">Producto</th>
                        <th className="py-2 text-center">Cant.</th>
                        <th className="py-2 text-right">P. Unit</th>
                        <th className="py-2 text-right">Subtotal</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {sale.detalles?.map((det: any) => (
                        <tr key={det.id} className="hover:bg-gray-50">
                            <td className="py-3 font-medium text-gray-800">
                                {det.producto?.nombre || 'Producto eliminado'}
                            </td>
                            <td className="py-3 text-center">{det.cantidad}</td>
                            <td className="py-3 text-right">S/ {Number(det.precioUnitario).toFixed(2)}</td>
                            <td className="py-3 text-right font-bold">S/ {Number(det.subTotal).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Footer Total */}
        <div className="bg-gray-50 p-6 border-t flex justify-end items-center gap-4">
            <span className="text-lg font-medium text-gray-600">Total Pagado:</span>
            <span className="text-3xl font-bold text-blue-600">S/ {Number(sale.total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};