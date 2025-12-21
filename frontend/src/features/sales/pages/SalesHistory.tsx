import { useEffect, useState } from 'react';
import api from '../../../config/api';
import { Eye, Ban, FileText, Search, ArrowUpDown } from 'lucide-react';

// Definimos la estructura de una Venta (debe coincidir con tu Backend)
interface Venta {
  id: number;
  fechaVenta: string;
  tipoComprobante: string; // BOLETA o FACTURA
  serie?: string;
  numero?: string;
  total: string | number;
  estado: string; // COMPLETADO o ANULADO
  cliente?: {
    nombres: string;
    dniRuc?: string;
  };
  usuario: {
    nombre: string;
  };
}

export const SalesHistory = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Cargar ventas al iniciar
  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const { data } = await api.get('/sales');
      setVentas(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar el historial de ventas.');
    } finally {
      setLoading(false);
    }
  };

  // Función para anular venta
  const handleAnular = async (id: number) => {
    if (!window.confirm('¿Estás seguro de anular esta venta? Esta acción devolverá el stock.')) return;

    try {
      await api.patch(`/sales/${id}/cancel`);
      alert('Venta anulada correctamente');
      fetchVentas(); // Recargamos la tabla
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al anular la venta');
    }
  };

  // Filtrar ventas por buscador (Cliente o ID)
  const ventasFiltradas = ventas.filter((v) => 
    v.cliente?.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.id.toString().includes(busqueda)
  );

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Historial de Ventas</h1>
          <p className="text-gray-500">Revisa todas las transacciones realizadas.</p>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por cliente o ID..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando ventas...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : ventas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay ventas registradas aún.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Comprobante</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">#{venta.id}</td>
                    <td className="px-6 py-4">
                      {new Date(venta.fechaVenta).toLocaleDateString()} <span className="text-xs text-gray-400">{new Date(venta.fechaVenta).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </td>
                    <td className="px-6 py-4">
                      {venta.cliente?.nombres || 'Cliente General'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                        <FileText size={12} />
                        {venta.tipoComprobante}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      S/ {Number(venta.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        venta.estado === 'ANULADO' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {venta.estado || 'COMPLETADO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {/* Botón Detalles (Futuro) */}
                      <button 
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        title="Ver Detalles"
                        onClick={() => alert(`Detalles de venta #${venta.id}`)}
                      >
                        <Eye size={18} />
                      </button>

                      {/* Botón Anular (Solo si no está anulada ya) */}
                      {venta.estado !== 'ANULADO' && (
                        <button 
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          title="Anular Venta"
                          onClick={() => handleAnular(venta.id)}
                        >
                          <Ban size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};