import { useState, useEffect } from 'react';
import { getDashboardData, type DashboardData } from '../services/dashboard.service';

export const useDashboardData = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await getDashboardData();
                setData(result);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Error al cargar datos del dashboard');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { data, loading, error };
};
