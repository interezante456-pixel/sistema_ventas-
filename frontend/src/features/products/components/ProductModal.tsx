import { useState, useEffect, useRef } from 'react';
import { X, Package, DollarSign, Hash, Layers, Image as ImageIcon, Upload } from 'lucide-react';
import api from '../../../config/api';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: any;
}

export const ProductModal = ({ isOpen, onClose, onSuccess, productToEdit }: ProductModalProps) => {
  // 👇 AQUÍ AGREGUÉ 'imagenUrl' PARA QUE TYPESCRIPT NO SE QUEJE
  const [formData, setFormData] = useState({
    codigo: '', nombre: '', descripcion: '', 
    precioCompra: '', precioVenta: '', stock: '', categoriaId: '', imagenUrl: ''
  });
  
  // Estados para la imagen
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    if (productToEdit) {
      setFormData({
        codigo: productToEdit.codigo,
        nombre: productToEdit.nombre,
        descripcion: productToEdit.descripcion || '',
        precioCompra: productToEdit.precioCompra,
        precioVenta: productToEdit.precioVenta,
        stock: productToEdit.stock,
        categoriaId: productToEdit.categoriaId,
        imagenUrl: productToEdit.imagenUrl || ''
      });
      setPreviewUrl(productToEdit.imagenUrl || '');
    } else {
      setFormData({ 
        codigo: '', nombre: '', descripcion: '', 
        precioCompra: '', precioVenta: '', stock: '', 
        categoriaId: '', imagenUrl: '' 
      });
      setPreviewUrl('');
      setSelectedFile(null);
    }
  }, [productToEdit, isOpen]);

  const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (err) { console.error(err); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('codigo', formData.codigo);
    data.append('nombre', formData.nombre);
    data.append('descripcion', formData.descripcion);
    data.append('precioCompra', formData.precioCompra);
    data.append('precioVenta', formData.precioVenta);
    data.append('stock', formData.stock);
    data.append('categoriaId', formData.categoriaId);

    if (selectedFile) {
        data.append('imagen', selectedFile);
    } else {
        // Si no hay archivo nuevo, enviamos la URL anterior para no perderla
        // (o enviamos cadena vacía si no había nada)
        data.append('imagenUrl', formData.imagenUrl || '');
    }
    // 👇👇 AGREGA ESTO PARA ESPIAR LOS DATOS EN LA CONSOLA 👇👇
    console.log("--- 🕵️‍♂️ DATOS QUE SE ENVÍAN AL BACKEND ---");
    for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
    }
    console.log("-------------------------------------------");
    // 👆👆 FIN DEL CÓDIGO DE DEPURACIÓN 👆👆

    try {
      // ✅ Axios pone el Content-Type correcto automáticamente con FormData
      if (productToEdit) {
        await api.patch(`/products/${productToEdit.id}`, data);
      } else {
        await api.post('/products', data);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="bg-white w-full max-w-lg mx-4 rounded-xl shadow-2xl border-2 border-gray-300 ring-4 ring-black/5 animate-in fade-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" size={20}/> {productToEdit ? 'Editar' : 'Nuevo'}
          </h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">{error}</div>}

          {/* Código y Categoría */}
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Código</label>
                <div className="relative">
                    <Hash className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input 
                      type="text" required 
                      className="pl-9 w-full border rounded-lg py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      value={formData.codigo} 
                      onChange={e => setFormData({...formData, codigo: e.target.value})} 
                      placeholder="Ej: 7750123"
                    />
                </div>
             </div>
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
                        {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                </div>
             </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" required 
              className="w-full border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.nombre} 
              onChange={e => setFormData({...formData, nombre: e.target.value})} 
              placeholder="Ej: Gaseosa Coca Cola 1.5L"
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Imagen del Producto</label>
            <div className="flex gap-4 items-start">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative group">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="text-gray-400" size={32} />
                    )}
                </div>
                <div className="flex-1">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm w-full justify-center transition-all"
                    >
                        <Upload size={16} />
                        {previewUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">Formatos: JPG, PNG, WEBP. Máx 5MB.</p>
                </div>
            </div>
          </div>

          {/* Precios y Stock */}
           <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">P. Compra</label>
              <input 
                type="number" step="0.01" required 
                className="w-full border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.precioCompra} 
                onChange={e => setFormData({...formData, precioCompra: e.target.value})} 
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">P. Venta</label>
              <input 
                type="number" step="0.01" required 
                className="w-full border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.precioVenta} 
                onChange={e => setFormData({...formData, precioVenta: e.target.value})} 
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Stock</label>
              <input 
                type="number" required 
                className="w-full border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.stock} 
                onChange={e => setFormData({...formData, stock: e.target.value})} 
                placeholder="0"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};