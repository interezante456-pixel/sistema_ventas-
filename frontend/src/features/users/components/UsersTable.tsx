import { User, Shield, KeyRound, Power, Trash2 } from 'lucide-react';
import type { Usuario } from '../hooks/useUsers';

interface UsersTableProps {
    usuarios: Usuario[];
    loading: boolean;
    error: string;
    currentUser: any;
    onPasswordClick: (user: Usuario) => void;
    onToggleClick: (user: Usuario) => void;
    onDeleteClick: (user: Usuario) => void;
}

export const UsersTable = ({
    usuarios,
    loading,
    error,
    currentUser,
    onPasswordClick,
    onToggleClick,
    onDeleteClick
}: UsersTableProps) => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            {loading ? (
                <div className="p-8 text-center text-gray-500">Cargando...</div>
            ) : error ? (
                <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-sm">
                        <tr>
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Usuario</th>
                            <th className="px-6 py-3">Rol</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                        {usuarios.map((user) => {
                            const isCurrentUser = currentUser && user.id === currentUser.id;
                            return (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${isCurrentUser ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            <User size={18} />
                                        </div>
                                        <div>
                                            {user.nombre}
                                            {isCurrentUser && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">(Tú)</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.usuario}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.rol === "ADMIN" ? "bg-purple-100 text-purple-800" :
                                                user.rol === "VENDEDOR" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                            <Shield size={12} />
                                            {user.rol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.estado ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                            {user.estado ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => onPasswordClick(user)}
                                                className="p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                                                title="Cambiar Contraseña"
                                            >
                                                <KeyRound size={18} />
                                            </button>
                                            <button
                                                onClick={() => onToggleClick(user)}
                                                disabled={isCurrentUser || !user.id} 
                                                className={`p-2 rounded-full transition-colors ${isCurrentUser 
                                                        ? 'opacity-30 cursor-not-allowed text-gray-400'
                                                        : user.estado 
                                                            ? "text-blue-400 hover:text-blue-600 hover:bg-blue-50"
                                                            : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                                                    }`}
                                                title={isCurrentUser ? "No puedes desactivarte a ti mismo" : (user.estado ? "Desactivar" : "Activar")}
                                            >
                                                <Power size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDeleteClick(user)}
                                                disabled={isCurrentUser}
                                                className={`p-2 rounded-full transition-colors ${isCurrentUser 
                                                        ? 'opacity-30 cursor-not-allowed text-gray-400' 
                                                        : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                    }`}
                                                title={isCurrentUser ? "No puedes eliminarte a ti mismo" : "Eliminar permanentemente"}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};
