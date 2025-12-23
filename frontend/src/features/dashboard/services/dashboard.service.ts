import axios from '../../../config/api';

export interface DashboardData {
    stats: {
        salesToday: number;
        ordersToday: number;
        clientsTotal: number;
        lowStock: number;
    };
    salesTrend: Array<{
        name: string;
        ventas: number;
    }>;
    topProducts: Array<{
        name: string;
        value: number;
    }>;
    topClients: Array<{
        name: string;
        purchases: number;
        total: string;
    }>;
    recentSales: Array<{
        id: string;
        client: string;
        amount: string;
        status: 'completed' | 'pending' | 'cancelled';
        date: string;
    }>;
}

export const getDashboardData = async (): Promise<DashboardData> => {
    const response = await axios.get('/dashboard');
    return response.data;
};

export const getLowStockItems = async () => {
    const response = await axios.get('/dashboard/low-stock');
    return response.data;
};
