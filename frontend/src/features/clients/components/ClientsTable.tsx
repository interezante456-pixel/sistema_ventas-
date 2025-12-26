import { Pencil, Trash2, User, Ban, CheckCircle } from 'lucide-react';

interface ClientsTableProps {
    clients: any[];
    loading: boolean;
    onEdit: (client: any) => void;
    onToggleStatus: (id: number, currentStatus: boolean) => void;
    onDelete: (id: number) => void;
}

export const ClientsTable = ({ clients, loading, onEdit, onToggleStatus, onDelete }: ClientsTableProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b text-gray-600 text-sm uppercase">
                    <tr>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">DNI / RUC</th>
                        <th className="p-4">Teléfono</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4">Dirección</th>
                        <th className="p-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                          <tr><td colSpan={6} className="p-8 text-center text-gray-500">Cargando...</td></tr>
                    ) : clients.length === 0 ? (
                          <tr><td colSpan={6} className="p-8 text-center text-gray-500">No se encontraron clientes.</td></tr>
                    ) : ( 
                        clients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                    <User size={16} />
                                </div>
                                {client.nombres}
                            </td>
                            <td className="p-4 text-gray-600 font-mono">{client.dniRuc}</td>
                            <td className="p-4 text-gray-600">{client.telefono || '-'}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    client.estado 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {client.estado ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td className="p-4 text-gray-600 truncate max-w-[200px]">{client.direccion || '-'}</td>
                            <td className="p-4 flex justify-center gap-2">
                                <button
                                    onClick={() => onEdit(client)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    title="Editar"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => onToggleStatus(client.id, client.estado)}
                                    className={`p-2 rounded-lg ${
                                        client.estado 
                                            ? 'text-orange-600 hover:bg-orange-50' 
                                            : 'text-green-600 hover:bg-green-50'
                                    }`}
                                    title={client.estado ? "Deshabilitar" : "Habilitar"}
                                >
                                    {client.estado ? <Ban size={18} /> : <CheckCircle size={18} />}
                                </button>
                                <button
                                    onClick={() => onDelete(client.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    title="Eliminar permanentemente"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    )))}
                </tbody>
            </table>
        </div>
    );
};
