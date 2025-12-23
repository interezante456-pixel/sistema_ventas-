import { useState } from 'react';
import { ClientModal } from '../components/ClientModal';
import { ToastNotification } from '../../users/components/ToastNotification';
import { ClientsHeader } from '../components/ClientsHeader';
import { ClientsFilters } from '../components/ClientsFilters';
import { ClientsTable } from '../components/ClientsTable';
import { useClients } from '../hooks/useClients';

export const ClientsPage = () => {
    // Hooks de Lógica
    const { 
        filteredClients, 
        loading, 
        searchTerm, 
        setSearchTerm, 
        toast, 
        setToast, 
        handleSave, 
        handleDelete 
    } = useClients();

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<any>(null);

    return (
        <div className="space-y-6">

            <ClientsHeader 
                onNewClient={() => {
                    setEditingClient(null);
                    setIsModalOpen(true);
                }} 
            />

            <ClientsFilters 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
            />

            <ClientsTable 
                clients={filteredClients}
                loading={loading}
                onEdit={(client) => {
                    setEditingClient(client);
                    setIsModalOpen(true);
                }}
                onDelete={(id) => {
                    if(confirm('¿Estás seguro de eliminar este cliente?')) {
                        handleDelete(id);
                    }
                }}
            />

            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={async (data) => {
                   const success = await handleSave(data, editingClient);
                   if(success) {
                       setIsModalOpen(false);
                       setEditingClient(null);
                   }
                }}
                client={editingClient}
            />

            {toast && (
                <ToastNotification 
                    message={toast.msg} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
        </div>
    );
};