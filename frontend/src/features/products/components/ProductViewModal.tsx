import { X, Package, Tag, DollarSign, Layers, Hash, AlignLeft, Image as ImageIcon } from 'lucide-react';

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any; // El producto seleccionado
}

export const ProductViewModal = ({ isOpen, onClose, product }: ProductViewModalProps) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      {/* Caja del Modal */}
      <div className="bg-white w-full max-w-2xl mx-4 rounded-xl shadow-2xl border-2 border-gray-300 ring-4 ring-black/5 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" size={20}/> 
            Detalle del Producto
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* COLUMNA IZQUIERDA: IMAGEN */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <div className="w-full aspect-square bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm relative group">
                {product.imagenUrl ? (
                  <img 
                    src={product.imagenUrl} 
                    alt={product.nombre} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <ImageIcon size={64} className="mb-2 opacity-50"/>
                    <span className="text-sm">Sin imagen</span>
                  </div>
                )}
                
                {/* Etiqueta de Stock flotante sobre la imagen */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm
                  ${product.stock <= 5 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                  Stock: {product.stock}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: DATOS */}
            <div className="w-full md:w-1/2 space-y-6">
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{product.nombre}</h2>
                <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                  <Hash size={14} />
                  <span>Cód: {product.codigo}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="bg-white p-2 rounded-full text-blue-600 shadow-sm">
                        <Layers size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-blue-600 font-bold uppercase">Categoría</p>
                        <p className="text-sm font-medium text-gray-900">{product.categoria?.nombre || 'Sin categoría'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="bg-white p-2 rounded-full text-green-600 shadow-sm">
                        <DollarSign size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-green-600 font-bold uppercase">Precio Venta</p>
                        <p className="text-xl font-bold text-gray-900">S/ {Number(product.precioVenta).toFixed(2)}</p>
                    </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="border-t pt-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <AlignLeft size={16} className="text-gray-400"/> Descripción
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {product.descripcion || "No hay descripción disponible para este producto."}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t text-right">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium shadow-md"
            >
                Cerrar
            </button>
        </div>
      </div>
    </div>
  );
};