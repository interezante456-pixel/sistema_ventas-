import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const useSalesExport = (filteredSales: any[]) => {

    const exportToExcel = () => {
        const headers = ["ID Venta", "Fecha", "Hora", "Vendedor", "Cliente", "DNI/RUC", "Comprobante", "Método Pago", "Total", "Estado"];
        const rows = filteredSales.map(sale => {
            const dateObj = new Date(sale.fechaVenta);
            return [
                sale.id,
                dateObj.toLocaleDateString(),
                dateObj.toLocaleTimeString(),
                `"${sale.usuario?.nombre || 'Desconocido'}"`,
                `"${sale.cliente?.nombres || 'Público General'}"`,
                `"${sale.cliente?.dniRuc || '-'}"`,
                sale.tipoComprobante,
                sale.metodoPago,
                sale.total,
                sale.estado ? "COMPLETADO" : "ANULADO"
            ];
        });

        const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Título del PDF
        doc.setFontSize(18);
        doc.text("Reporte de Ventas - SIVRA", 14, 20);
        doc.setFontSize(10);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 28);

        // Generar Tabla
        autoTable(doc, {
            startY: 35,
            head: [['ID', 'Fecha', 'Vendedor', 'Cliente', 'Tipo', 'Pago', 'Total']], // Reduje columnas para que quepa mejor
            body: filteredSales.map(sale => [
                sale.id,
                new Date(sale.fechaVenta).toLocaleDateString(),
                sale.usuario?.nombre || 'Desc.',
                sale.cliente?.nombres || 'Público General',
                sale.tipoComprobante,
                sale.metodoPago,
                `S/ ${Number(sale.total).toFixed(2)}`
            ]),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] } // Color azul bonito
        });

        doc.save(`reporte_ventas_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return {
        exportToExcel,
        exportToPDF
    };
};
