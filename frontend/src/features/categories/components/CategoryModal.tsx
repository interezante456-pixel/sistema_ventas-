import { useState, useEffect } from 'react';
import { X, Save, Layers, AlignLeft } from 'lucide-react';
import api from '../../../config/api';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: any;
}

export const CategoryModal = ({ isOpen, onClose, onSuccess, categoryToEdit }: CategoryModalProps) => {
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({ 
        nombre: categoryToEdit.nombre, 
        descripcion: categoryToEdit.descripcion || '' 
      });
    } else {
      setFormData({ nombre: '', descripcion: '' });
    }
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (categoryToEdit) {
        await api.patch(`/categories/${categoryToEdit.id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert('Error al guardar categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="bg-white w-full max-w-sm mx-4 rounded-xl shadow-2xl border-2 border-gray-300 ring-4 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Layers className="text-purple-600" size={20}/> 
            {categoryToEdit ? 'Editar Categoría' : 'Nueva Categoría'}
          </h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nombre</label>
            <div className="relative">
              <Layers className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                type="text" required autoFocus
                className="pl-9 w-full border rounded-lg py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Ej: Bebidas"
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Descripción (Opcional)</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <textarea 
                className="pl-9 w-full border rounded-lg py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none h-24"
                placeholder="Detalles de la categoría..."
                value={formData.descripcion}
                onChange={e => setFormData({...formData, descripcion: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};