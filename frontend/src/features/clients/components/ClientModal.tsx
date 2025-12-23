import { useEffect, useState } from 'react';
import { X, Save, User, Phone, MapPin, CreditCard } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  client?: any; // Si viene cliente, es EDICIÓN. Si no, es CREACIÓN.
}

export const ClientModal = ({ isOpen, onClose, onSave, client }: ClientModalProps) => {
  const [formData, setFormData] = useState({
    nombres: '',
    dniRuc: '',
    telefono: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (client) {
        setFormData({
            nombres: client.nombres || '',
            dniRuc: client.dniRuc || '',
            telefono: client.telefono || '',
            direccion: client.direccion || ''
        });
    } else {
        setFormData({ nombres: '', dniRuc: '', telefono: '', direccion: '' });
    }
    setError('');
  }, [client, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombres || !formData.dniRuc) {
        setError('Nombre y DNI/RUC son obligatorios');
        return;
    }
    try {
        setLoading(true);
        await onSave(formData);
        onClose();
    } catch (err: any) {
        setError('Error al guardar cliente');
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
                <User size={20} className="text-blue-400"/> 
                {client ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <button onClick={onClose}><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded">{error}</div>}
            
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo / Razón Social *</label>
                <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-gray-400"/>
                    <input 
                        type="text" className="w-full pl-9 border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.nombres} onChange={e => setFormData({...formData, nombres: e.target.value})}
                        placeholder="Ej: Juan Perez" autoFocus
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">DNI / RUC *</label>
                <div className="relative">
                    <CreditCard size={16} className="absolute left-3 top-3 text-gray-400"/>
                    <input 
                        type="text" className="w-full pl-9 border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.dniRuc} onChange={e => setFormData({...formData, dniRuc: e.target.value})}
                        placeholder="Ej: 77123456"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
                    <div className="relative">
                        <Phone size={16} className="absolute left-3 top-3 text-gray-400"/>
                        <input 
                            type="text" className="w-full pl-9 border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Dirección</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-3 text-gray-400"/>
                        <input 
                            type="text" className="w-full pl-9 border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancelar</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg">
                    <Save size={18}/> {loading ? 'Guardando...' : 'Guardar Cliente'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};