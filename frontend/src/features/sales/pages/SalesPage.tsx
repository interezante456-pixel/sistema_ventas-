import { useState, useEffect } from 'react';
import { Search, Calendar, Eye, FileDown, Filter } from 'lucide-react';
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

  useEffect(() => {
    fetchSales();
  }, []);

  // Recargar ventas
  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/sales'); 
      // Asumimos que el backend devuelve todas las ventas ordenadas por fecha desc
      setSales(data);
      setFilteredSales(data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de filtrado en tiempo real
  useEffect(() => {
    let result = sales;

    // Filtro por Buscador (Cliente o ID)
    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        result = result.filter(s => 
            s.cliente?.nombres.toLowerCase().includes(lowerTerm) || 
            s.id.toString().includes(lowerTerm)
        );
    }

    // Filtro por Fecha
    if (dateFilter) {
        result = result.filter(s => s.fecha.startsWith(dateFilter));
    }

    setFilteredSales(result);
  }, [searchTerm, dateFilter, sales]);

  const handleOpenDetail = (sale: any) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header y Estadísticas Rápidas */}
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

      {/* Barra de Herramientas (Filtros) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
         
         {/* Buscador */}
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

         {/* Filtro Fecha */}
         <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
                type="date" 
                className="pl-10 border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
            />
         </div>

         {/* Botón Exportar (Visual por ahora) */}
         <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
            <FileDown size={20} /> Exportar
         </button>
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
                                    {new Date(sale.fecha).toLocaleDateString()} <span className="text-xs text-gray-400">{new Date(sale.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip"
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
        
        {/* Paginación simple (Visual) */}
        <div className="p-4 border-t bg-gray-50 text-xs text-gray-500 flex justify-between">
            <span>Mostrando {filteredSales.length} registros</span>
            {/* Aquí podrías agregar botones de paginación real si el backend lo soporta */}
        </div>
      </div>

      {/* Modal de Detalles */}
      <SaleDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sale={selectedSale}
      />

    </div>
  );
};