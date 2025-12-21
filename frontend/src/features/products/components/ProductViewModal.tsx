import { X, Package, Tag, DollarSign, Layers, Hash, AlignLeft, Box, Activity, Image as ImageIcon } from 'lucide-react';

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export const ProductViewModal = ({ isOpen, onClose, product }: ProductViewModalProps) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      {/* Caja del Modal (Más ancha para acomodar la imagen: max-w-2xl) */}
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

        {/* Contenido Principal (Layout de 2 columnas en PC) */}
        <div className="p-6 flex flex-col md:flex-row gap-6">
          
          {/* --- COLUMNA IZQUIERDA: IMAGEN --- */}
          <div className="w-full md:w-1/3 flex flex-col">
            {/* Contenedor cuadrado para la imagen */}
            <div className="aspect-square bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden relative shadow-sm group">
                {product.imagenUrl ? (
                    <img 
                        src={product.imagenUrl} 
                        alt={product.nombre} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    // Placeholder si no hay imagen
                    <div className="text-gray-400 flex flex-col items-center justify-center h-full w-full bg-gray-50">
                        <ImageIcon size={48} className="mb-2 opacity-40"/>
                        <span className="text-xs font-medium opacity-60">Sin imagen</span>
                    </div>
                )}
            </div>
            {/* Código de barras debajo de la imagen */}
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-sm font-mono bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 w-full text-center">
              <Hash size={14} className="text-gray-400"/>
              <span className="font-semibold">{product.codigo}</span>
            </div>
          </div>

          {/* --- COLUMNA DERECHA: DATOS --- */}
          <div className="w-full md:w-2/3 space-y-5">
            
            {/* Nombre y Estado */}
            <div className="flex justify-between items-start gap-4 pb-3 border-b">
                 <h2 className="text-2xl font-bold text-gray-900 leading-tight">{product.nombre}</h2>
                 <span className={`px-2 py-1 rounded-full text-xs font-bold border flex items-center gap-1 shrink-0 ${product.estado ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                    <Activity size={12}/> {product.estado ? "Activo" : "Inactivo"}
                 </span>
            </div>

            {/* Grilla de Detalles */}
            <div className="grid grid-cols-2 gap-4">
                {/* Categoría */}
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><Layers size={14}/> Categoría</span>
                    <span className="font-medium text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                        {product.categoria?.nombre || 'Sin categoría'}
                    </span>
                </div>
                 {/* Stock */}
                 <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><Box size={14}/> Stock</span>
                    <span className={`font-bold text-lg px-3 py-1 rounded-lg border ${product.stock <= 5 ? 'text-red-700 bg-red-50 border-red-100' : 'text-gray-900 bg-gray-50 border-gray-200'}`}>
                        {product.stock} <small className="font-normal text-sm">un.</small>
                    </span>
                </div>
                {/* Precio Venta */}
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><DollarSign size={14}/> Precio Venta</span>
                    <span className="font-bold text-xl text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                        S/ {Number(product.precioVenta).toFixed(2)}
                    </span>
                </div>
                 {/* Costo */}
                 <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><Tag size={14}/> Costo (Compra)</span>
                    <span className="font-medium text-gray-700 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
                        S/ {Number(product.precioCompra).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Descripción */}
            <div>
                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                    <AlignLeft size={14}/> Descripción
                </h4>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-700 leading-relaxed h-24 overflow-y-auto">
                    {product.descripcion || "Sin descripción registrada."}
                </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium shadow-sm"
            >
                Cerrar
            </button>
        </div>
      </div>
    </div>
  );
};