import { useEffect, useState } from 'react';
import { Package, Plus, Search, Edit, Trash2, Eye, RefreshCw, Activity } from 'lucide-react'; 
import api from '../../../config/api';
import { ProductModal } from '../components/ProductModal';
import { ConfirmModal } from '../../users/components/ConfirmModal';
import { ToastNotification } from '../../users/components/ToastNotification';
import { ProductViewModal } from '../components/ProductViewModal';

export const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  
  // Modal Vista
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [productToView, setProductToView] = useState<any>(null);

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

  const handleDeleteOrRestore = async () => {
    if (!productToDelete) return;
    try {
      const nuevoEstado = !productToDelete.estado;
      await api.patch(`/products/${productToDelete.id}`, { estado: nuevoEstado });
      setToast({ 
        msg: nuevoEstado ? 'Producto restaurado' : 'Producto eliminado', 
        type: 'success' 
      });
      fetchProducts();
    } catch (error) {
      setToast({ msg: 'Error al procesar', type: 'error' });
    }
  };

  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
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

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
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

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-3">Código</th>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3 text-right">Precio Venta</th>
                <th className="px-6 py-3 text-center">Stock</th>
                {/* 👇 NUEVA COLUMNA ESTADO */}
                <th className="px-6 py-3 text-center">Estado</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Cargando...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">No hay productos.</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className={`transition-colors group border-b last:border-none ${!product.estado ? 'bg-gray-100/80 grayscale-[0.8]' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 font-mono text-gray-600">{product.codigo}</td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                             {product.imagenUrl ? (
                                <img src={product.imagenUrl} alt="" className="w-full h-full object-cover"/>
                             ) : (
                                <Package size={16} className="text-gray-400"/>
                             )}
                        </div>
                        <span className={`font-medium ${!product.estado ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {product.nombre}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                        {product.categoria?.nombre || 'Sin Cat.'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-700">
                      S/ {Number(product.precioVenta).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock <= 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {product.stock} un.
                      </span>
                    </td>

                    {/* 👇 AQUÍ VA LA CELDA DE ESTADO */}
                    <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border
                            ${product.estado 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                            <Activity size={12} />
                            {product.estado ? "Activo" : "Inactivo"}
                        </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => { setProductToView(product); setIsViewOpen(true); }}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Ver detalle"
                        >
                          <Eye size={18} />
                        </button>

                        <button 
                          onClick={() => { setProductToEdit(product); setIsModalOpen(true); }}
                          className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>

                        <button 
                          onClick={() => { setProductToDelete(product); setIsConfirmOpen(true); }}
                          className={`p-2 rounded-lg ${!product.estado ? "text-green-600 hover:bg-green-50" : "text-gray-500 hover:text-red-600 hover:bg-red-50"}`}
                          title={!product.estado ? "Restaurar" : "Eliminar"}
                        >
                          {!product.estado ? <RefreshCw size={18} /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProducts}
        productToEdit={productToEdit}
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteOrRestore}
        title={productToDelete?.estado ? "¿Eliminar Producto?" : "¿Restaurar Producto?"}
        message={productToDelete?.estado 
            ? "El producto pasará a inactivos." 
            : "El producto volverá a estar activo."}
        isDelete={productToDelete?.estado}
      />

      <ProductViewModal 
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        product={productToView}
      />

      {toast && <ToastNotification message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};