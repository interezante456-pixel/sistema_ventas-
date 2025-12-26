import { useState } from 'react';
import api from '../../../config/api';
import { generateSaleTicketPdf } from '../utils/saleTicketGenerator';

interface UseSaleEmailResult {
    sendEmail: (sale: any, targetEmail: string, isAuto?: boolean) => Promise<void>;
    emailStatus: 'idle' | 'sending' | 'success' | 'error';
    emailMessage: string;
}

export const useSaleEmail = (): UseSaleEmailResult => {
    const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [emailMessage, setEmailMessage] = useState('');

    const sendEmail = async (sale: any, targetEmail: string, isAuto: boolean = false) => {
        if (!targetEmail) return;
        
        try {
            setEmailStatus('sending');
            if (isAuto) setEmailMessage(`Enviando comprobante automáticamente a ${targetEmail}...`);
            else setEmailMessage(`Enviando a ${targetEmail}...`);

            const pdfBlob = generateSaleTicketPdf(sale);
            const formData = new FormData();
            formData.append('pdf', pdfBlob, `Ticket_${sale.id}.pdf`);
            formData.append('email', targetEmail);

            await api.post(`/sales/${sale.id}/email`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setEmailStatus('success');
            setEmailMessage(`Correo enviado correctamente a ${targetEmail}`);
        } catch (error) {
            console.error("Error enviando email", error);
            setEmailStatus('error');
            setEmailMessage("Error al enviar el correo. Intente manualmente.");
        }
    };

    return { sendEmail, emailStatus, emailMessage };
};
