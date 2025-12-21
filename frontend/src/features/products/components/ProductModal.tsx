import { useState, useEffect } from 'react';
import { X, Save, Package, DollarSign, Hash, Layers } from 'lucide-react';
import api from '../../../config/api';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: any; // Si pasamos un producto, es modo edición
}

export const ProductModal = ({ isOpen, onClose, onSuccess, productToEdit }: ProductModalProps) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    precioCompra: '',
    precioVenta: '',
    stock: '',
    categoriaId: ''
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos si es edición y cargar categorías siempre
  useEffect(() => {
    fetchCategories();
    if (productToEdit) {
      setFormData({
        codigo: productToEdit.codigo,
        nombre: productToEdit.nombre,
        precioCompra: productToEdit.precioCompra,
        precioVenta: productToEdit.precioVenta,
        stock: productToEdit.stock,
        categoriaId: productToEdit.categoriaId
      });
    } else {
      setFormData({ codigo: '', nombre: '', precioCompra: '', precioVenta: '', stock: '', categoriaId: '' });
    }
  }, [productToEdit, isOpen]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error("Error cargando categorías");
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (productToEdit) {
        await api.put(`/products/${productToEdit.id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      {/* Fondo y contenedor con estilo flotante */}
      <div className="bg-white w-full max-w-lg mx-4 rounded-xl shadow-2xl border-2 border-gray-300 ring-4 ring-black/5 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" size={20}/> 
            {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            {/* Código */}
            <div className="col-span-1">
              <label className="block text-xs font-bold text-gray-700 mb-1">Código de Barras</label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                  type="text" required 
                  className="pl-9 w-full border rounded-lg py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="CODE123"
                  value={formData.codigo}
                  onChange={e => setFormData({...formData, codigo: e.target.value})}
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="col-span-1">
              <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
              <div className="relative">
                <Layers className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <select 
                  required
                  className="pl-9 w-full border rounded-lg py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.categoriaId}
                  onChange={e => setFormData({...formData, categoriaId: e.target.value})}
                >
                  <option value="">Seleccionar...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del Producto</label>
            <input 
              type="text" required 
              className="w-full border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: Gaseosa Coca Cola 3L"
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          {/* Precios y Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">P. Compra</label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 text-gray-400" size={14} />
                <input type="number" step="0.01" required 
                  className="pl-6 w-full border rounded-lg py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0.00"
                  value={formData.precioCompra}
                  onChange={e => setFormData({...formData, precioCompra: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">P. Venta</label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 text-gray-400" size={14} />
                <input type="number" step="0.01" required 
                  className="pl-6 w-full border rounded-lg py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0.00"
                  value={formData.precioVenta}
                  onChange={e => setFormData({...formData, precioVenta: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Stock</label>
              <input type="number" required 
                className="w-full border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};