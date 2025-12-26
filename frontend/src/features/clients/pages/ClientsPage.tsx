import { useState } from 'react';
import { ClientModal } from '../components/ClientModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
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
        toggleStatus,
        handleDelete
    } = useClients();

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<any>(null);
    const [clientToDelete, setClientToDelete] = useState<number | null>(null);

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
                onToggleStatus={toggleStatus}
                onDelete={(id) => {
                    setClientToDelete(id);
                    setIsDeleteModalOpen(true);
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

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setClientToDelete(null);
                }}
                onConfirm={() => {
                    if (clientToDelete) {
                        handleDelete(clientToDelete);
                    }
                }}
                title="Eliminar Cliente"
                message="¿Estás seguro de eliminar este cliente permanentemente? Esta acción no se puede deshacer."
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