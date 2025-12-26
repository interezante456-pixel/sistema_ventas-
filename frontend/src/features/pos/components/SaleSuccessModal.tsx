import { CheckCircle, Printer, MessageCircle, Mail } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useSaleEmail } from '../hooks/useSaleEmail';
import { generateSaleTicketPdf } from '../utils/saleTicketGenerator';
import { getSaleWhatsAppUrl } from '../utils/whatsappUtils';

interface SaleSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: any; 
}

export const SaleSuccessModal = ({ isOpen, onClose, sale }: SaleSuccessModalProps) => {
  const { sendEmail, emailStatus, emailMessage } = useSaleEmail();
  const hasAutoSent = useRef(false);

  // Efecto para envío automático de correo
  useEffect(() => {
    if (isOpen && sale && sale.cliente?.email && !hasAutoSent.current) {
        hasAutoSent.current = true;
        sendEmail(sale, sale.cliente.email, true);
    }
  }, [isOpen, sale, sendEmail]);

  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    const blob = generateSaleTicketPdf(sale);
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const openWhatsApp = () => {
    const url = getSaleWhatsAppUrl(sale);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 text-center p-8">
        
        <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full ring-8 ring-green-50 animate-bounce">
                <CheckCircle size={64} className="text-green-600" />
            </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Venta Exitosa!</h2>
        
        {/* Estado del Correo Automático */}
        {emailStatus !== 'idle' && (
            <div className={`text-sm mb-4 px-3 py-2 rounded-lg ${
                emailStatus === 'sending' ? 'bg-blue-50 text-blue-700' :
                emailStatus === 'success' ? 'bg-green-50 text-green-700' :
                'bg-red-50 text-red-700'
            }`}>
               {
                   emailStatus === 'sending' ? <span className="flex items-center justify-center gap-2"><div className="w-3 h-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"/> {emailMessage}</span> :
                   emailStatus === 'success' ? <span className="flex items-center justify-center gap-2"><CheckCircle size={14}/> {emailMessage}</span> :
                   <span>{emailMessage}</span>
               }
            </div>
        )}

        <div className="space-y-3 mt-6">
            {/* WhatsApp - 1 Click */}
            <button 
                onClick={openWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <MessageCircle size={20} /> Enviar al WhatsApp
            </button>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    <Printer size={18} /> Imprimir
                </button>
                 <button 
                    onClick={() => {
                        const email = sale.cliente?.email || prompt("Ingrese correo del cliente:");
                        if(email) sendEmail(sale, email);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    <Mail size={18} /> Correo
                </button>
            </div>

            <button 
                onClick={onClose}
                className="w-full mt-2 text-gray-400 hover:text-gray-600 font-semibold py-2 text-sm"
            >
                Cerrar y Nueva Venta
            </button>
        </div>

      </div>
    </div>
  );
};