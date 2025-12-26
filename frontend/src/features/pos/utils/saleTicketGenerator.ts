import jsPDF from 'jspdf';

export const generateSaleTicketPdf = (sale: any): Blob => {
    // 80mm width = approx 226 points / 3.14 inch
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 297]
    });

    const MARGIN = 5;
    const PAGE_WIDTH = 80;
    let yPos = 10;

    const centerText = (text: string, y: number) => {
        const textWidth = doc.getTextWidth(text);
        const x = (PAGE_WIDTH - textWidth) / 2;
        doc.text(text, x, y);
    };

    const drawLine = (y: number) => {
        doc.setLineWidth(0.1);
        doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
        return y + 3;
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

    // --- RENDERIZADO DEL TICKET EN MEMORIA ---
    doc.setFontSize(12); doc.setFont("helvetica", "bold");
    centerText("SIVRA MARKET", yPos); yPos += 5;
    
    doc.setFontSize(8); doc.setFont("helvetica", "normal");
    centerText("RUC: 20123456789", yPos); yPos += 4;
    centerText("Av. Principal 123, Lima, Perú", yPos); yPos += 4;
    
    yPos = drawLine(yPos);

    doc.setFontSize(8);
    leftRichText("Ticket:", `#001-${sale.id.toString().padStart(6, '0')}`, yPos); yPos += 4;
    const fechaStr = sale.fechaVenta ? new Date(sale.fechaVenta).toLocaleString() : new Date().toLocaleString();
    leftRichText("Fecha:", fechaStr, yPos); yPos += 4;
    leftRichText("Cliente:", sale.cliente?.nombres || "Público General", yPos); yPos += 5;

    yPos = drawLine(yPos);

    doc.setFont("helvetica", "bold");
    doc.text("Cant.", MARGIN, yPos);
    doc.text("Desc.", MARGIN + 10, yPos);
    rightText("Total", yPos);
    yPos += 4;
    
    doc.setFont("helvetica", "normal");
    sale.detalles.forEach((det: any) => {
        const cantidad = det.cantidad.toString();
        const descripcion = det.producto?.nombre?.substring(0, 20) || "Producto";
        const total = `S/${Number(det.subtotal).toFixed(2)}`;
        
        doc.text(cantidad, MARGIN, yPos);
        doc.text(descripcion, MARGIN + 10, yPos);
        rightText(total, yPos);
        yPos += 3.5;
    });
    
    yPos = drawLine(yPos);

    const total = Number(sale.total);
    doc.setFontSize(10); doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", 35, yPos); rightText(`S/ ${total.toFixed(2)}`, yPos); yPos += 6;

    centerText("¡Gracias por su compra!", yPos);

    return doc.output('blob');
};
