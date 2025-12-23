import { useState, useEffect } from 'react';
import api from '../../../config/api';

export const useSales = () => {
    const [sales, setSales] = useState<any[]>([]);
    const [filteredSales, setFilteredSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/sales');
            setSales(data);
            setFilteredSales(data);
        } catch (error) {
            console.error("Error al cargar historial:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = sales;
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(s =>
                s.cliente?.nombres.toLowerCase().includes(lowerTerm) ||
                s.id.toString().includes(lowerTerm)
            );
        }
        if (dateFilter) {
            result = result.filter(s => s.fechaVenta.startsWith(dateFilter));
        }
        setFilteredSales(result);
    }, [searchTerm, dateFilter, sales]);

    return {
        sales,
        filteredSales,
        loading,
        searchTerm,
        setSearchTerm,
        dateFilter,
        setDateFilter,
        refreshSales: fetchSales
    };
};
