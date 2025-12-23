import { Trophy } from 'lucide-react';

interface TopClientsListProps {
    clients: Array<{ name: string; purchases: number; total: string }>;
}

export const TopClientsList = ({ clients }: TopClientsListProps) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Clientes Frecuentes
            </h3>
            <div className="space-y-4">
                {clients.map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
                ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                    index === 1 ? 'bg-gray-100 text-gray-700' :
                                        index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-600'}`}>
                                {index + 1}
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-gray-800">{client.name}</p>
                                <p className="text-xs text-gray-500">{client.purchases} compras</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-sm text-gray-700">{client.total}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
