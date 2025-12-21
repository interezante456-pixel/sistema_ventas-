import { useState, useEffect } from 'react';
import { X, Save, Lock, User, Shield, Type } from 'lucide-react';
import api from '../../../config/api';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserModal = ({ isOpen, onClose, onSuccess }: UserModalProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    password: '',
    rol: 'VENDEDOR'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setShowModal(true);
    } else {
        const timer = setTimeout(() => setShowModal(false), 300);
        return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/users', formData);
      onSuccess();
      onClose();
      setTimeout(() => {
          setFormData({ nombre: '', usuario: '', password: '', rol: 'VENDEDOR' });
      }, 300); 
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  if (!showModal && !isOpen) return null;

  return (
    // Contenedor invisible (solo para centrar)
    <div 
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-out
            ${isOpen ? 'bg-transparent visible' : 'bg-transparent invisible pointer-events-none'}`}
    >
      
      {/* 👇 EL MODAL CON CONTORNOS FUERTES 👇 */}
      <div 
          className={`bg-white w-full max-w-md mx-4 rounded-xl overflow-hidden transform transition-all duration-300 ease-out
              /* EFECTOS DE BORDE Y SOMBRA: */
              shadow-2xl border-2 border-gray-300 ring-4 ring-black/5
              ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-95'}`}
      >
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Nuevo Usuario</h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200 shadow-sm">
              {error}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
            <div className="relative group">
              <Type className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                required
                className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Usuario</label>
            <div className="relative group">
              <User className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                required
                className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                placeholder="Ej: jperez"
                value={formData.usuario}
                onChange={(e) => setFormData({...formData, usuario: e.target.value})}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="password"
                required
                className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                placeholder="******"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Rol</label>
            <div className="relative group">
              <Shield className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <select
                className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white transition-all shadow-sm"
                value={formData.rol}
                onChange={(e) => setFormData({...formData, rol: e.target.value})}
              >
                <option value="VENDEDOR">Vendedor</option>
                <option value="ALMACEN">Almacenero</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
          </div>

          {/* Footer Botones */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all shadow active:scale-95 disabled:bg-blue-400"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};