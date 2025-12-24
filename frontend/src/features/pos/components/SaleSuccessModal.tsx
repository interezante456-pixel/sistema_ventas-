import { CheckCircle, Printer, ArrowRight } from 'lucide-react';
import jsPDF from 'jspdf';

interface SaleSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: any; // La venta que acabamos de crear
}

export const SaleSuccessModal = ({ isOpen, onClose, sale }: SaleSuccessModalProps) => {
  if (!isOpen || !sale) return null;

  // 🖨️ Función para Generar el TICKET PROFESIONAL (80mm)
  const handlePrint = () => {
    // 80mm width = approx 226 points / 3.14 inch
    // Height is flexible depending on content, initiating with generous height
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 297] // 80mm width, standard A4 height (auto-cut by printer usually)
    });

    // --- CONFIGURACIÓN DE FUENTES Y ESTILOS ---
    const MARGIN = 5;
    const PAGE_WIDTH = 80;
    // const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2); // Unused
    let yPos = 10;

    const centerText = (text: string, y: number) => {
        const textWidth = doc.getTextWidth(text);
        const x = (PAGE_WIDTH - textWidth) / 2;
        doc.text(text, x, y);
    };

    const drawLine = (y: number) => {
        doc.setLineWidth(0.1);
        doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
        return y + 3; // Return next Y position
    };

    const rightText = (text: string, y: number) => {
        const textWidth = doc.getTextWidth(text);
        doc.text(text, PAGE_WIDTH - MARGIN - textWidth, y);
    };

    const leftRichText = (label: string, value: string, y: number) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, MARGIN, y);
        doc.setFont("helvetica", "normal");
        const labelWidth = doc.getTextWidth(label + " ");
        doc.text(value, MARGIN + labelWidth, y);
    };

    // --- CABECERA ---
    doc.setFontSize(12); doc.setFont("helvetica", "bold");
    centerText("SIVRA MARKET", yPos); yPos += 5;
    
    doc.setFontSize(8); doc.setFont("helvetica", "normal");
    centerText("RUC: 20123456789", yPos); yPos += 4;
    centerText("Av. Principal 123, Lima, Perú", yPos); yPos += 4;
    centerText("Tel: (01) 555-0909", yPos); yPos += 5;

    yPos = drawLine(yPos);

    // --- DETALLES DE VENTA ---
    doc.setFontSize(8);
    leftRichText("Ticket:", `#001-${sale.id.toString().padStart(6, '0')}`, yPos); yPos += 4;
    
    // Fix: Usar fechaVenta que viene del backend, o fallback
    const fechaStr = sale.fechaVenta ? new Date(sale.fechaVenta).toLocaleString() : new Date().toLocaleString();
    leftRichText("Fecha:", fechaStr, yPos); yPos += 4;
    
    leftRichText("Cajero:", sale.usuario?.nombre || "Admin", yPos); yPos += 4;
    leftRichText("Cliente:", sale.cliente?.nombres || "Público General", yPos); yPos += 5;

    yPos = drawLine(yPos);

    // --- ÍTEMS (TABLA MANUAL LIGERA) ---
    doc.setFont("helvetica", "bold");
    doc.text("Cant.", MARGIN, yPos);
    doc.text("Desc.", MARGIN + 10, yPos);
    rightText("Total", yPos);
    yPos += 4;
    
    doc.setFont("helvetica", "normal");
    sale.detalles.forEach((det: any) => {
        const cantidad = det.cantidad.toString();
        const descripcion = det.producto?.nombre?.substring(0, 20) || "Producto"; // Truncate if too long
        const total = `S/${Number(det.subtotal).toFixed(2)}`;
        const pUnit = `(S/${Number(det.precio).toFixed(2)})`;

        doc.text(cantidad, MARGIN, yPos);
        doc.text(descripcion, MARGIN + 10, yPos);
        rightText(total, yPos);
        yPos += 3.5;
        
        // P. Unit below description
        doc.setFontSize(7);
        doc.setTextColor(100);
        doc.text(pUnit, MARGIN + 10, yPos); 
        doc.setTextColor(0);
        doc.setFontSize(8);
        
        yPos += 3;
    });
    
    yPos += 2;
    yPos = drawLine(yPos);

    // --- TOTALES ---
    // Cálculos
    const total = Number(sale.total);
    const subtotal = total / 1.18;
    const igv = total - subtotal;

    // Subtotal
    doc.text("Subtotal:", 35, yPos); rightText(`S/ ${subtotal.toFixed(2)}`, yPos); yPos += 4;
    doc.text("IGV (18%):", 35, yPos); rightText(`S/ ${igv.toFixed(2)}`, yPos); yPos += 4;
    
    // Total Grande
    doc.setFontSize(10); doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", 35, yPos); rightText(`S/ ${total.toFixed(2)}`, yPos); yPos += 6;

    // Métodos de Pago
    doc.setFontSize(8); doc.setFont("helvetica", "normal");
    
    // Método
    const metodoPago = sale.metodoPago || "EFECTIVO"; 
    doc.text(`Medio Pago: ${metodoPago}`, MARGIN, yPos); yPos += 4;

    // Importe Pagado (Nuevo)
    const pagado = Number(sale.montoPago) || total; // Si es tarjeta/yape suele ser exacto, si es efectivo viene el monto
    doc.text("Importe Pagado:", MARGIN, yPos);
    rightText(`S/ ${pagado.toFixed(2)}`, yPos); yPos += 4;

    // Vuelto
    doc.text("Vuelto:", MARGIN, yPos);
    const vuelto = Math.max(0, pagado - total);
    rightText(`S/ ${vuelto.toFixed(2)}`, yPos); yPos += 8;

    // --- FOOTER ---
    centerText("¡Gracias por su compra!", yPos); yPos += 4;
    doc.setFontSize(7);
    centerText("Representación impresa de la", yPos); yPos += 3;
    centerText("Boleta de Venta Electrónica", yPos); yPos += 4;
    
    // Simular QR o Barcode (Texto placeholder o librería externa)
    // Para simplificar, ponemos texto por ahora o usamos libreria barcode si estuviera instalada
    // centerText("||| || ||| || |||| |||", yPos); 

    // Guardar
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