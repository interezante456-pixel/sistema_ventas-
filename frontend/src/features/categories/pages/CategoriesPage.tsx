import { useEffect, useState } from 'react';
import { Layers, Plus, Edit, Trash2, Search } from 'lucide-react';
import api from '../../../config/api';
import { CategoryModal } from '../components/CategoryModal';
import { ConfirmModal } from '../../users/components/ConfirmModal';
import { ToastNotification } from '../../users/components/ToastNotification';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<number | null>(null);
  
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error("Error cargando categorías");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!catToDelete) return;
    try {
      await api.delete(`/categories/${catToDelete}`);
      setToast({ msg: 'Categoría eliminada correctamente', type: 'success' });
      fetchCategories();
    } catch (error: any) {
      // Mostramos el mensaje de error que viene del backend (ej: tiene productos)
      setToast({ 
        msg: error.response?.data?.error || 'No se pudo eliminar la categoría', 
        type: 'error' 
      });
    }
  };

  const filteredCategories = categories.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
          <p className="text-gray-500">Organiza tus productos en grupos.</p>
        </div>
        <button 
          onClick={() => { setCategoryToEdit(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 shadow-md transition-all active:scale-95"
        >
          <Plus size={20} /> Nueva Categoría
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden max-w-4xl mx-auto md:mx-0">
        <div className="p-4 border-b bg-gray-50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar categoría..." 
              className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Descripción</th>
              <th className="px-6 py-3 text-center">Productos</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">Cargando...</td></tr>
            ) : filteredCategories.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No hay categorías registradas.</td></tr>
            ) : (
              filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">{cat.nombre}</td>
                  <td className="px-6 py-4 text-gray-600">{cat.descripcion || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold border">
                      {cat._count?.productos || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button 
                      onClick={() => { setCategoryToEdit(cat); setIsModalOpen(true); }}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => { setCatToDelete(cat.id); setIsConfirmOpen(true); }}
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

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCategories}
        categoryToEdit={categoryToEdit}
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="¿Eliminar Categoría?"
        message="Si eliminas esta categoría, asegúrate de que no tenga productos asociados."
        isDelete={true}
      />

      {toast && <ToastNotification message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};