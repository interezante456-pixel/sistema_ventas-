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

export const downloadSalesRegister = async () => {
    const response = await axios.get('/reports/sales-register', {
        responseType: 'blob'
    });
    // Crear un blob link para descargar
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RegistroVentas_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const downloadInventoryValuation = async () => {
    const response = await axios.get('/reports/inventory-valuation', {
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `InventarioValorizado_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const downloadBalanceSheet = async () => {
    const response = await axios.get('/reports/balance-sheet', {
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Balance_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};
