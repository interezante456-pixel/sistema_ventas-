import axios from '../../../config/api';

export interface DashboardData {
    stats: {
        salesTotal: number;
        ordersCount: number;
        activeClients: number;
        lowStock: number;
        totalPurchases: number;
        netProfit: number;
    };
    salesTrend: Array<{
        name: string;
        ventas: number;
    }>;
    yearlySales: Array<{
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

export interface WarehouseData {
    totalValue: number;
    totalProducts: number;
    criticalStock: number;
    movementsToday: number;
    movementsTrend: Array<{ name: string; Entrada: number; Salida: number }>;
    categoryStats: Array<{ name: string; value: number }>;
    recentMovements: Array<{
        id: number;
        product: string;
        type: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
        quantity: number;
        date: string;
        reason: string;
    }>;
}

export const getDashboardData = async (month?: number, year?: number, viewUserId?: number): Promise<DashboardData> => {
    const params: any = {};
    if (month !== undefined && month !== null) params.month = month;
    if (year) params.year = year;
    if (viewUserId) params.viewUserId = viewUserId;

    const response = await axios.get('/dashboard', { params });
    return response.data;
};

export const getWarehouseDashboardData = async (): Promise<WarehouseData> => {
    const response = await axios.get('/dashboard/warehouse');
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
