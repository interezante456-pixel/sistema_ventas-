import { Edit2, Trash2, Phone, MapPin, Building } from 'lucide-react';
import type { Provider } from '../services/providers.service';

interface ProvidersTableProps {
    providers: Provider[];
    onEdit: (provider: Provider) => void;
    onDelete: (id: number) => void;
}

export const ProvidersTable = ({ providers, onEdit, onDelete }: ProvidersTableProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Razón Social</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">RUC</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Contacto</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Dirección</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {providers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No hay proveedores registrados.
                                </td>
                            </tr>
                        ) : (
                            providers.map((provider) => (
                                <tr key={provider.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <Building size={18} />
                                            </div>
                                            <span className="font-medium text-gray-900">{provider.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-600">
                                        {provider.ruc || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-gray-400" />
                                                {provider.telefono || '-'}
                                            </div>
                                            {provider.email && (
                                                <span className="text-xs text-blue-500">{provider.email}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-gray-400" />
                                            {provider.direccion || 'Sin dirección'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => onEdit(provider)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(provider.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
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
    );
};
