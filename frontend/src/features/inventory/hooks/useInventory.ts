import { useState, useEffect, useCallback } from 'react';
import { getKardex, createAdjustment } from '../services/inventory.service';
import type { StockMovement, InventoryFilters, CreateAdjustmentDto } from '../services/inventory.service';

export const useInventory = () => {
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadKardex = useCallback(async (filters?: InventoryFilters) => {
        setLoading(true);
        try {
            const data = await getKardex(filters);
            setMovements(data);
        } catch (err) {
            setError('Error al cargar movimientos de inventario');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const registerAdjustment = async (data: CreateAdjustmentDto) => {
        try {
            await createAdjustment(data);
            await loadKardex(); // Recargar la lista después del ajuste
            return { success: true };
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || 'Error al crear ajuste';
            return { success: false, error: msg };
        }
    };

    // Cargar inicialmente sin filtros
    useEffect(() => {
        loadKardex();
    }, [loadKardex]);

    return {
        movements,
        loading,
        error,
        filteredMovements: movements, // Por si queremos filtrar en cliente también
        refresh: loadKardex,
        registerAdjustment
    };
};
