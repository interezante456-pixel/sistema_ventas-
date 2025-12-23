import { UserPlus } from 'lucide-react';

interface UsersHeaderProps {
    onNewUser: () => void;
}

export const UsersHeader = ({ onNewUser }: UsersHeaderProps) => {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
                <p className="text-gray-500">Administra el acceso al sistema.</p>
            </div>
            <button
                onClick={onNewUser}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
                <UserPlus size={20} />
                Nuevo Usuario
            </button>
        </div>
    );
};
