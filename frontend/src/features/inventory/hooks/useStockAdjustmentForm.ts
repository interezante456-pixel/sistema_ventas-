import { useState } from 'react';

interface AdjustmentData {
    productoId: number;
    tipo: 'ENTRADA' | 'SALIDA';
    cantidad: number;
    motivo: string;
}

interface UseStockAdjustmentFormProps {
    onSuccess: (data: AdjustmentData) => Promise<any>;
    onClose: () => void;
}

export const useStockAdjustmentForm = ({ onSuccess, onClose }: UseStockAdjustmentFormProps) => {
    const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
    const [type, setType] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct || !quantity || !reason) return;

        setLoading(true);
        const result = await onSuccess({
            productoId: Number(selectedProduct),
            tipo: type,
            cantidad: Number(quantity),
            motivo: reason
        });
        setLoading(false);

        if (result.success) {
            onClose();
            // Reset form
            setSelectedProduct('');
            setType('ENTRADA');
            setQuantity('');
            setReason('');
        } else {
            alert(result.error);
        }
    };

    return {
        selectedProduct,
        setSelectedProduct,
        type,
        setType,
        quantity,
        setQuantity,
        reason,
        setReason,
        loading,
        handleSubmit
    };
};
