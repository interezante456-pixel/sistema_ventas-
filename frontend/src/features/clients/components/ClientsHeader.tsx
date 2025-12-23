import { UserPlus } from 'lucide-react';

interface ClientsHeaderProps {
    onNewClient: () => void;
}

export const ClientsHeader = ({ onNewClient }: ClientsHeaderProps) => {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
                <p className="text-gray-500">Administra tu cartera de clientes.</p>
            </div>
            <button
                onClick={onNewClient}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg"
            >
                <UserPlus size={20} /> Nuevo Cliente
            </button>
        </div>
    );
};
