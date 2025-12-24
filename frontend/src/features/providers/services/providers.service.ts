import api from '../../../config/api';

export interface Provider {
    id: number;
    ruc?: string;
    nombre: string;
    telefono?: string;
    direccion?: string;
    email?: string;
    estado: boolean;
}

export const getProviders = async () => {
    const response = await api.get<Provider[]>('/providers');
    return response.data;
};

export const createProvider = async (data: Partial<Provider>) => {
    const response = await api.post<Provider>('/providers', data);
    return response.data;
};

export const updateProvider = async (id: number, data: Partial<Provider>) => {
    const response = await api.put<Provider>(`/providers/${id}`, data);
    return response.data;
};

export const deleteProvider = async (id: number) => {
    const response = await api.delete(`/providers/${id}`);
    return response.data;
};
