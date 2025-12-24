import { useState, useEffect } from 'react';
import { getPurchases, createPurchase } from '../services/purchases.service';
import type { Purchase, CreatePurchaseDto } from '../services/purchases.service';

export const usePurchases = () => {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadPurchases = async () => {
        setLoading(true);
        try {
            const data = await getPurchases();
            setPurchases(data);
        } catch (err) {
            setError('Error al cargar historial de compras');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPurchases();
    }, []);

    const registerPurchase = async (data: CreatePurchaseDto) => {
        setLoading(true);
        try {
            await createPurchase(data);
            await loadPurchases(); // Refresh list if needed, though we usually redirect
            return { success: true };
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || 'Error al registrar compra';
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    // Calculate total stats if needed?
    
    return {
        purchases,
        loading,
        error,
        registerPurchase,
        refresh: loadPurchases
    };
};
