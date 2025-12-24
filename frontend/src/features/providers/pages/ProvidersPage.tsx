import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useProviders } from '../hooks/useProviders';
import { ProvidersTable } from '../components/ProvidersTable';
import { ProviderModal } from '../components/ProviderModal';
import type { Provider } from '../services/providers.service';

export const ProvidersPage = () => {
    const { providers, loading, addProvider, editProvider, removeProvider } = useProviders();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

    const handleCreate = () => {
        setEditingProvider(null);
        setIsModalOpen(true);
    };

    const handleEdit = (provider: Provider) => {
        setEditingProvider(provider);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: Partial<Provider>) => {
        if (editingProvider) {
            return await editProvider(editingProvider.id, data);
        } else {
            return await addProvider(data);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Proveedores</h1>
                    <p className="text-gray-500">Gestiona tus distribuidores y socios comerciales</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                    <Plus size={20} />
                    Nuevo Proveedor
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando proveedores...</p>
                </div>
            ) : (
                <ProvidersTable 
                    providers={providers} 
                    onEdit={handleEdit} 
                    onDelete={removeProvider} 
                />
            )}

            <ProviderModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingProvider}
            />
        </div>
    );
};
