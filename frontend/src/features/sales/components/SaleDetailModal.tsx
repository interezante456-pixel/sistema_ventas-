import { X, Package, Calendar, User, CreditCard, FileText, Hash, Tag } from 'lucide-react';

interface SaleDetailModalProps {
  sale: any;
  isOpen: boolean;
  onClose: () => void;
}

export const SaleDetailModal = ({ sale, isOpen, onClose }: SaleDetailModalProps) => {
  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-start shrink-0">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="text-blue-400"/> Detalle de Venta #{sale.id}
                </h2>
                <div className="flex gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(sale.fecha).toLocaleString()}</span>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Info Resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b text-sm shrink-0">
            <div>
                <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Cliente</span>
                <div className="flex items-center gap-2">
                    <User size={16} className="text-blue-600"/>
                    <span className="font-medium text-gray-900 truncate">
                        {sale.cliente ? sale.cliente.nombres : 'Público General'}
                    </span>
                </div>
            </div>
            <div>
                <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Método Pago</span>
                <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-green-600"/>
                    <span className="font-medium text-gray-900">{sale.metodoPago}</span>
                </div>
            </div>
             <div>
                <span className="text-xs text-gray-500 font-bold uppercase block mb-1">N° Operación</span>
                <div className="flex items-center gap-2">
                    <Hash size={16} className="text-purple-600"/>
                    <span className="font-medium text-gray-900">
                        {sale.referencia || '-'}
                    </span>
                </div>
            </div>
            <div>
                <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Comprobante</span>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${
                    sale.tipoComprobante === 'FACTURA' 
                    ? 'bg-purple-100 text-purple-700 border-purple-200' 
                    : 'bg-blue-100 text-blue-700 border-blue-200'
                }`}>
                    {sale.tipoComprobante}
                </span>
            </div>
        </div>

        {/* Tabla de Productos con TODOS LOS CAMPOS */}
        <div className="flex-1 overflow-y-auto p-0">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 font-bold text-xs uppercase sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="py-3 px-6">Producto</th>
                        <th className="py-3 px-4 text-center">Cant.</th>
                        <th className="py-3 px-4 text-right">Precio Unit.</th>
                        <th className="py-3 px-4 text-right text-red-500">Descuento</th>
                        <th className="py-3 px-6 text-right">Subtotal</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {sale.detalles?.map((det: any) => (
                        <tr key={det.id} className="hover:bg-gray-50 transition-colors">
                            {/* Producto */}
                            <td className="py-3 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 border flex items-center justify-center overflow-hidden shrink-0">
                                        {det.producto?.imagenUrl ? (
                                            <img src={det.producto.imagenUrl} className="w-full h-full object-cover"/>
                                        ) : (
                                            <Package size={18} className="text-gray-400"/>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{det.producto?.nombre}</p>
                                        <p className="text-xs text-gray-400">{det.producto?.codigo}</p>
                                    </div>
                                </div>
                            </td>
                            
                            {/* Cantidad */}
                            <td className="py-3 px-4 text-center font-medium">
                                {det.cantidad}
                            </td>

                            {/* Precio Unitario */}
                            <td className="py-3 px-4 text-right text-gray-600">
                                S/ {Number(det.precio).toFixed(2)}
                            </td>

                            {/* Descuento (Si hay) */}
                            <td className="py-3 px-4 text-right">
                                {Number(det.descuento) > 0 ? (
                                    <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded-full">
                                        - S/ {Number(det.descuento).toFixed(2)}
                                    </span>
                                ) : (
                                    <span className="text-gray-300">-</span>
                                )}
                            </td>

                            {/* Subtotal */}
                            <td className="py-3 px-6 text-right font-bold text-gray-900">
                                S/ {Number(det.subtotal).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Footer Total */}
        <div className="bg-gray-50 p-6 border-t shrink-0 flex justify-end gap-8 items-center">
            <div className="text-right">
                <p className="text-xs text-gray-500 font-bold uppercase">Base Imponible</p>
                {/* Calculamos base aproximada restando IGV simple para visualización */}
                <p className="text-gray-700 font-medium">S/ {(Number(sale.total) / 1.18).toFixed(2)}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-gray-500 font-bold uppercase">IGV (18%)</p>
                <p className="text-gray-700 font-medium">S/ {(Number(sale.total) - (Number(sale.total) / 1.18)).toFixed(2)}</p>
            </div>
            <div className="text-right pl-6 border-l border-gray-300">
                <p className="text-xs text-gray-500 font-bold uppercase">Total Pagado</p>
                <p className="text-3xl font-bold text-blue-600">S/ {Number(sale.total).toFixed(2)}</p>
            </div>
        </div>
      </div>
    </div>
  );
};