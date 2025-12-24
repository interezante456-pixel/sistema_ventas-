import { useState, useEffect } from 'react';
import { getProviders, createProvider, updateProvider, deleteProvider } from '../services/providers.service';
import type { Provider } from '../services/providers.service';

export const useProviders = () => {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadProviders = async () => {
        setLoading(true);
        try {
            const data = await getProviders();
            setProviders(data);
        } catch (err) {
            setError('Error al cargar proveedores');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProviders();
    }, []);

    const addProvider = async (data: Partial<Provider>) => {
        try {
            await createProvider(data);
            await loadProviders();
            return { success: true };
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Error al crear proveedor';
            return { success: false, error: msg };
        }
    };

    const editProvider = async (id: number, data: Partial<Provider>) => {
        try {
            await updateProvider(id, data);
            await loadProviders();
            return { success: true };
        } catch (error: any) {
             const msg = error.response?.data?.error || 'Error al actualizar proveedor';
             return { success: false, error: msg };
        }
    };

    const removeProvider = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este proveedor?')) return;
        try {
            await deleteProvider(id);
            await loadProviders();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar proveedor');
        }
    };

    return {
        providers,
        loading,
        error,
        addProvider,
        editProvider,
        removeProvider,
        refresh: loadProviders
    };
};
