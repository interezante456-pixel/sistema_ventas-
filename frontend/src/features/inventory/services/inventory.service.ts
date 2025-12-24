import api from '../../../config/api';

export interface StockMovement {
    id: number;
    tipo: 'ENTRADA' | 'SALIDA';
    cantidad: number;
    motivo: string;
    fecha: string;
    producto?: {
        codigo: string;
        nombre: string;
        imagenUrl: string | null;
    }
}

export interface InventoryFilters {
    startDate?: string;
    endDate?: string;
    productoId?: number;
    tipo?: 'ENTRADA' | 'SALIDA';
}

export interface CreateAdjustmentDto {
    productoId: number;
    tipo: 'ENTRADA' | 'SALIDA';
    cantidad: number;
    motivo: string;
}

export const getKardex = async (filters?: InventoryFilters) => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.productoId) params.append('productoId', String(filters.productoId));
    if (filters?.tipo) params.append('tipo', filters.tipo);

    const response = await api.get<StockMovement[]>(`/inventory/kardex?${params.toString()}`);
    return response.data;
};

export const createAdjustment = async (data: CreateAdjustmentDto) => {
    const response = await api.post('/inventory/adjustment', data);
    return response.data;
};
