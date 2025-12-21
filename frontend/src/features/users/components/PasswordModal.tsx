import { useState } from 'react';
import { X, Save, KeyRound } from 'lucide-react';
import api from '../../../config/api';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
  onSuccess: () => void;
}

export const PasswordModal = ({ isOpen, onClose, userId, onSuccess }: PasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !userId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return alert("La contraseña debe tener al menos 6 caracteres");
    
    setLoading(true);
    try {
      // Usamos PATCH para actualizar solo la contraseña
      await api.patch(`/users/${userId}`, { password });
      onSuccess();
      setPassword('');
      onClose();
    } catch (error) {
      alert("Error al actualizar contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-transparent">
      <div className="bg-white w-full max-w-sm mx-4 rounded-xl shadow-2xl border-2 border-gray-300 ring-4 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <KeyRound size={20} className="text-orange-500"/> Cambiar Contraseña
          </h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Nueva Contraseña</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300">
              {loading ? 'Guardando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};