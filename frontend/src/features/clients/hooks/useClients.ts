import { useState, useEffect } from 'react';
import api from '../../../config/api';

export const useClients = () => {
    const [clients, setClients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/clients');
            setClients(data);
        } catch (error) {
            console.error("Error cargando clientes");
            setToast({ msg: 'Error al cargar clientes', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data: any, editingClient: any) => {
        try {
            if (editingClient) {
                await api.patch(`/clients/${editingClient.id}`, data);
                setToast({ msg: 'Cliente actualizado correctamente', type: 'success' });
            } else {
                await api.post('/clients', { ...data, estado: true });
                setToast({ msg: 'Cliente creado correctamente', type: 'success' });
            }
            fetchClients();
            return true;
        } catch (error) {
            setToast({ msg: 'Error al guardar', type: 'error' });
            return false;
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/clients/${id}`);
            fetchClients();
            setToast({ msg: 'Cliente eliminado', type: 'success' });
        } catch (error) {
            setToast({ msg: 'Error al eliminar', type: 'error' });
        }
    };

    const filteredClients = clients.filter(c =>
        c.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.dniRuc.includes(searchTerm)
    );

    return {
        clients,
        filteredClients,
        loading,
        searchTerm,
        setSearchTerm,
        toast,
        setToast,
        fetchClients,
        handleSave,
        handleDelete
    };
};
