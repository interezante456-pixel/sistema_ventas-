import { useState, useEffect } from 'react';
import api from '../../../config/api';

export const useCategories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error("Error cargando categorías");
            setToast({ msg: 'Error al cargar las categorías', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (catToDelete: number) => {
        if (!catToDelete) return;
        try {
            await api.delete(`/categories/${catToDelete}`);
            setToast({ msg: 'Categoría eliminada correctamente', type: 'success' });
            fetchCategories();
            return true;
        } catch (error: any) {
            setToast({
                msg: error.response?.data?.error || 'No se pudo eliminar la categoría',
                type: 'error'
            });
            return false;
        }
    };

    const filteredCategories = categories.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        categories,
        filteredCategories,
        loading,
        searchTerm,
        setSearchTerm,
        toast,
        setToast,
        fetchCategories,
        handleDelete
    };
};
