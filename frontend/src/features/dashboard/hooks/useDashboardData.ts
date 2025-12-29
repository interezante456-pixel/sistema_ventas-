import { useState, useEffect } from 'react';
import { getDashboardData, type DashboardData } from '../services/dashboard.service';

export const useDashboardData = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<{ month?: number, year: number }>({
        year: new Date().getFullYear(),
        month: new Date().getMonth()
    });

    const refresh = async () => {
        try {
            setLoading(true);
            const result = await getDashboardData(filters.month, filters.year);
            setData(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al cargar datos del dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, [filters]);

    return { data, loading, error, filters, setFilters, refresh };
};
