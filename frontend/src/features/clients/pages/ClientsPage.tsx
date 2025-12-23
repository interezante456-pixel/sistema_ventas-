import { useEffect, useState } from 'react';
import { Search, UserPlus, Pencil, Trash2, User } from 'lucide-react';
import api from '../../../config/api';
import { ClientModal } from '../components/ClientModal';
import { ToastNotification } from '../../users/components/ToastNotification';

export const ClientsPage = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
        const { data } = await api.get('/clients');
        setClients(data);
    } catch (error) { console.error("Error cargando clientes"); }
  };

  const handleSave = async (data: any) => {
    try {
        if (editingClient) {
            await api.patch(`/clients/${editingClient.id}`, data);
            setToast({ msg: 'Cliente actualizado correctamente', type: 'success' });
        } else {
            await api.post('/clients', { ...data, estado: true });
            setToast({ msg: 'Cliente creado correctamente', type: 'success' });
        }
        fetchClients();
        setIsModalOpen(false);
        setEditingClient(null);
    } catch (error) {
        setToast({ msg: 'Error al guardar', type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
      if(!confirm('¿Estás seguro de eliminar este cliente?')) return;
      try {
          await api.delete(`/clients/${id}`);
          fetchClients();
          setToast({ msg: 'Cliente eliminado', type: 'success' });
      } catch (error) { setToast({ msg: 'Error al eliminar', type: 'error' }); }
  };

  const filteredClients = clients.filter(c => 
    c.nombres.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.dniRuc.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
            <p className="text-gray-500">Administra tu cartera de clientes.</p>
        </div>
        <button 
            onClick={() => { setEditingClient(null); setIsModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg"
        >
            <UserPlus size={20}/> Nuevo Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
                type="text" placeholder="Buscar por nombre o DNI/RUC..."
                className="pl-10 w-full border border-gray-300 rounded-lg py-2 outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-gray-600 text-sm uppercase">
                <tr>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">DNI / RUC</th>
                    <th className="p-4">Teléfono</th>
                    <th className="p-4">Dirección</th>
                    <th className="p-4 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredClients.map(client => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <User size={16}/>
                            </div>
                            {client.nombres}
                        </td>
                        <td className="p-4 text-gray-600 font-mono">{client.dniRuc}</td>
                        <td className="p-4 text-gray-600">{client.telefono || '-'}</td>
                        <td className="p-4 text-gray-600 truncate max-w-[200px]">{client.direccion || '-'}</td>
                        <td className="p-4 flex justify-center gap-2">
                            <button onClick={() => { setEditingClient(client); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Pencil size={18}/>
                            </button>
                            <button onClick={() => handleDelete(client.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 size={18}/>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {filteredClients.length === 0 && <div className="p-8 text-center text-gray-500">No se encontraron clientes.</div>}
      </div>

      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
        client={editingClient}
      />
      
      {toast && <ToastNotification message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};