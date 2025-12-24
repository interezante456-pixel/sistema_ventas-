import api from '../../../config/api';
import type { Provider } from '../../providers/services/providers.service';

export interface PurchaseDetail {
    productoId: number;
    cantidad: number;
    precio: number;
    producto?: {
        nombre: string;
        codigo: string;
    }
}

export interface Purchase {
    id: number;
    proveedorId: number;
    usuarioId: number;
    fechaCompra: string;
    total: number | string; // Decimal comes as string often
    proveedor?: Provider;
    usuario?: {
        nombre: string;
    };
    detalles?: PurchaseDetail[];
}

export interface CreatePurchaseDto {
    proveedorId: number;
    usuarioId: number;
    fechaCompra?: string;
    detalles: {
        productoId: number;
        cantidad: number;
        precio: number;
    }[];
}

export const getPurchases = async () => {
    const response = await api.get<Purchase[]>('/purchases');
    return response.data;
};

export const getPurchaseById = async (id: number) => {
    const response = await api.get<Purchase>(`/purchases/${id}`);
    return response.data;
};

export const createPurchase = async (data: CreatePurchaseDto) => {
    const response = await api.post<Purchase>('/purchases', data);
    return response.data;
};
