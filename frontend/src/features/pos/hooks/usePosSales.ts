import { useState } from 'react';
import api from '../../../config/api';

export const usePosSales = (cart: any[], calculateTotal: () => number, onSuccess: (sale: any) => void, onError: (msg: string) => void) => {
    const [processing, setProcessing] = useState(false);

    const processSale = async (paymentData: any) => {
        try {
            setProcessing(true);
            const payload = {
                tipoComprobante: paymentData.tipoComprobante,
                clienteId: paymentData.clienteId,
                metodoPago: paymentData.metodoPago,
                montoPago: paymentData.montoPago,
                referencia: paymentData.referencia,
                total: calculateTotal(),
                detalles: cart.map((item) => ({
                    productoId: item.id,
                    cantidad: item.cantidad,
                    precio: Number(item.precioVenta),
                    subtotal: Number(item.precioVenta) * item.cantidad,
                })),
            };

            // 1. Enviar al Backend
            const response = await api.post("/sales", payload);
            const createdSale = response.data;
            
            // 3. Agregar el dato "montoPago" manualmente para el cálculo de vuelto en el modal
            createdSale.montoPago = paymentData.montoPago;

            onSuccess(createdSale);

        } catch (error: any) {
            console.error(error);
            const errMsg = error.response?.data?.error || "Error al procesar la venta";
            onError(errMsg);
        } finally {
            setProcessing(false);
        }
    };

    return {
        processSale,
        processing
    };
};
