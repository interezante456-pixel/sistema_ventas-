import { useEffect, useState } from 'react';
import { Package, Plus, Search, Edit, Trash2 } from 'lucide-react';
import api from '../../../config/api';
import { ProductModal } from '../components/ProductModal';
import { ConfirmModal } from '../../users/components/ConfirmModal'; // Reutilizamos el que ya tienes
import { ToastNotification } from '../../users/components/ToastNotification'; // Reutilizamos

export const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete}`);
      setToast({ msg: 'Producto eliminado correctamente', type: 'success' });
      fetchProducts();
    } catch (error) {
      setToast({ msg: 'Error al eliminar producto', type: 'error' });
    }
  };

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventario de Productos</h1>
          <p className="text-gray-500">Gestiona tu catálogo y stock.</p>
        </div>
        <button 
          onClick={() => { setProductToEdit(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
        >
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      {/* Buscador y Tabla */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        {/* Barra de Búsqueda */}
        <div className="p-4 border-b bg-gray-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o código..." 
              className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-3">Código</th>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3 text-right">Precio Venta</th>
                <th className="px-6 py-3 text-center">Stock</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Cargando productos...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No hay productos registrados.</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-600">{product.codigo}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{product.nombre}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                        {product.categoria?.nombre || 'Sin Cat.'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">
                      S/ {Number(product.precioVenta).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock <= 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {product.stock} un.
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center gap-2">
                      <button 
                        onClick={() => { setProductToEdit(product); setIsModalOpen(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => { setProductToDelete(product.id); setIsConfirmOpen(true); }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProducts}
        productToEdit={productToEdit}
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="¿Eliminar Producto?"
        message="Esta acción eliminará el producto del inventario permanentemente."
        isDelete={true}
      />

      {toast && <ToastNotification message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};