import { useState, useEffect } from 'react';
import { Search, Calendar, Eye, FileDown, FileSpreadsheet, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../../../config/api';
import { SaleDetailModal } from '../components/SaleDetailModal';

export const SalesPage = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [filteredSales, setFilteredSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Estados para Modal
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para el menú de exportación
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/sales'); 
      setSales(data);
      setFilteredSales(data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = sales;
    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        result = result.filter(s => 
            s.cliente?.nombres.toLowerCase().includes(lowerTerm) || 
            s.id.toString().includes(lowerTerm)
        );
    }
    if (dateFilter) {
        result = result.filter(s => s.fecha.startsWith(dateFilter));
    }
    setFilteredSales(result);
  }, [searchTerm, dateFilter, sales]);

  const handleOpenDetail = (sale: any) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  // ----------------------------------------------------
  // 🟢 LÓGICA DE EXPORTACIÓN (EXCEL Y PDF)
  // ----------------------------------------------------

  const exportToExcel = () => {
    const headers = ["ID Venta", "Fecha", "Hora", "Cliente", "DNI/RUC", "Comprobante", "Método Pago", "Total", "Estado"];
    const rows = filteredSales.map(sale => {
        const dateObj = new Date(sale.fecha);
        return [
            sale.id,
            dateObj.toLocaleDateString(),
            dateObj.toLocaleTimeString(),
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
    setShowExportMenu(false); // Cerrar menú
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
        head: [['ID', 'Fecha', 'Cliente', 'Tipo', 'Pago', 'Total', 'Estado']],
        body: filteredSales.map(sale => [
            sale.id,
            new Date(sale.fecha).toLocaleDateString(),
            sale.cliente?.nombres || 'Público General',
            sale.tipoComprobante,
            sale.metodoPago,
            `S/ ${Number(sale.total).toFixed(2)}`,
            sale.estado ? 'COMPLETADO' : 'ANULADO'
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] } // Color azul bonito
    });

    doc.save(`reporte_ventas_${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportMenu(false); // Cerrar menú
  };

  return (
    <div className="space-y-6" onClick={() => showExportMenu && setShowExportMenu(false)}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Historial de Ventas</h1>
            <p className="text-gray-500">Consulta y gestiona las transacciones realizadas.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Ventas Totales:</span>
            <span className="text-lg font-bold text-blue-600">{filteredSales.length}</span>
        </div>
      </div>

      {/* Barra de Filtros y Botón Exportar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 z-10 relative">
         <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Buscar por cliente o N° venta..."
                className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
         </div>

         <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
                type="date" 
                className="pl-10 border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
            />
         </div>

         {/* BOTÓN EXPORTAR CON MENÚ DESPLEGABLE */}
         <div className="relative">
             <button 
                onClick={(e) => {
                    e.stopPropagation(); // Evita que el click cierre el menú inmediatamente
                    setShowExportMenu(!showExportMenu);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors shadow-sm"
             >
                <FileDown size={20} /> Exportar
             </button>

             {showExportMenu && (
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                     <button 
                        onClick={exportToExcel}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors text-left"
                     >
                        <FileSpreadsheet size={18} className="text-green-600"/> Excel (CSV)
                     </button>
                     <button 
                        onClick={exportToPDF}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors text-left border-t border-gray-50"
                     >
                        <FileText size={18} className="text-red-600"/> Documento PDF
                     </button>
                 </div>
             )}
         </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b text-gray-600 text-sm uppercase tracking-wider">
                        <th className="p-4 font-bold"># ID</th>
                        <th className="p-4 font-bold">Fecha</th>
                        <th className="p-4 font-bold">Cliente</th>
                        <th className="p-4 font-bold">Tipo</th>
                        <th className="p-4 font-bold">Pago</th>
                        <th className="p-4 font-bold text-right">Total</th>
                        <th className="p-4 font-bold text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan={7} className="p-8 text-center text-gray-500">Cargando historial...</td></tr>
                    ) : filteredSales.length === 0 ? (
                        <tr><td colSpan={7} className="p-8 text-center text-gray-500">No se encontraron ventas.</td></tr>
                    ) : (
                        filteredSales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-900">#{sale.id}</td>
                                <td className="p-4 text-gray-600 text-sm">
                                    {new Date(sale.fecha).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-gray-800 font-medium">
                                    {sale.cliente ? sale.cliente.nombres : <span className="text-gray-400 italic">Público General</span>}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                        sale.tipoComprobante === 'FACTURA' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                        {sale.tipoComprobante}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{sale.metodoPago}</td>
                                <td className="p-4 text-right font-bold text-gray-900">
                                    S/ {Number(sale.total).toFixed(2)}
                                </td>
                                <td className="p-4 flex justify-center">
                                    <button 
                                        onClick={() => handleOpenDetail(sale)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Ver Detalles"
                                    >
                                        <Eye size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <SaleDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sale={selectedSale}
      />

    </div>
  );
};