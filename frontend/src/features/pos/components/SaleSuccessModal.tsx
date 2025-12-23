import { CheckCircle, Printer, ArrowRight, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SaleSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: any; // La venta que acabamos de crear
}

export const SaleSuccessModal = ({ isOpen, onClose, sale }: SaleSuccessModalProps) => {
  if (!isOpen || !sale) return null;

  // 🖨️ Función para Generar el PDF (Idéntica a la del historial)
  const handlePrint = () => {
    const doc = new jsPDF();
    
    // Encabezado
    doc.setFontSize(18); doc.setFont("helvetica", "bold");
    doc.text("SIVRA MARKET", 105, 20, { align: "center" });
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text("RUC: 20123456789", 105, 26, { align: "center" });
    
    // Info Venta
    doc.text(`N° Venta: ${sale.id.toString().padStart(6, '0')}`, 20, 40);
    doc.text(`Fecha: ${new Date(sale.fecha).toLocaleString()}`, 20, 46);
    doc.text(`Cliente: ${sale.cliente?.nombres || "Público General"}`, 20, 52);

    // Tabla
    const tableBody = sale.detalles.map((det: any) => [
        det.producto?.nombre,
        det.cantidad,
        `S/ ${Number(det.precio).toFixed(2)}`,
        `S/ ${Number(det.subtotal).toFixed(2)}`
    ]);

    autoTable(doc, {
        startY: 60,
        head: [['Desc.', 'Cant.', 'P. Unit', 'Total']],
        body: tableBody,
        theme: 'plain',
        styles: { fontSize: 9 },
        headStyles: { fontStyle: 'bold' }
    });

    // Totales
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12); doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: S/ ${Number(sale.total).toFixed(2)}`, 190, finalY, { align: "right" });

    doc.save(`Ticket_Venta_${sale.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 text-center p-8">
        
        {/* Ícono de Éxito Animado */}
        <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full ring-8 ring-green-50 animate-bounce">
                <CheckCircle size={64} className="text-green-600" />
            </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Venta Exitosa!</h2>
        <p className="text-gray-500 mb-8">La transacción se registró correctamente.</p>

        {/* Resumen Rápido */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Total Pagado</span>
                <span className="text-xl font-bold text-gray-900">S/ {Number(sale.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Vuelto</span>
                <span className="text-sm font-bold text-green-600">
                    {/* Calculamos vuelto si existe info de pago, sino 0 */}
                    S/ {sale.montoPago ? Math.max(0, Number(sale.montoPago) - Number(sale.total)).toFixed(2) : '0.00'}
                </span>
            </div>
        </div>

        {/* Botones de Acción */}
        <div className="space-y-3">
            <button 
                onClick={handlePrint}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <Printer size={20} /> Imprimir Comprobante
            </button>

            <button 
                onClick={onClose}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
                Nueva Venta <ArrowRight size={18} />
            </button>
        </div>

      </div>
    </div>
  );
};