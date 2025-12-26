import { useState, useEffect } from 'react';
import { X, CreditCard, User, FileText, Banknote, Wallet, UserPlus, ArrowLeft, Search } from 'lucide-react';
import api from '../../../config/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (saleData: any) => void;
  total: number;
}

export const PaymentModal = ({ isOpen, onClose, onConfirm, total }: PaymentModalProps) => {
  // Estados de Venta
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [tipoComprobante, setTipoComprobante] = useState('BOLETA');
  const [clienteId, setClienteId] = useState<string>(''); 
  const [montoRecibido, setMontoRecibido] = useState('');
  
  // Estados de Datos
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  // Estados para "Nuevo Cliente"
  const [isNewClientMode, setIsNewClientMode] = useState(false);
  const [newClientData, setNewClientData] = useState({
    nombres: '',
    dniRuc: '',
    telefono: '',
    direccion: '',
    email: ''
  });

  useEffect(() => {
    if (isOpen) {
        loadClients();
        setMontoRecibido('');
        setError('');
        setIsNewClientMode(false);
    }
  }, [isOpen]);

  const loadClients = async () => {
      try {
          const { data } = await api.get('/clients');
          setClientes(data);
      } catch (err) { console.error("Error cargando clientes - Verifica que la ruta /clients exista en el backend"); }
  };

  const handleSearch = async () => {
        if (!newClientData.dniRuc || (newClientData.dniRuc.length !== 8 && newClientData.dniRuc.length !== 11)) {
            setError('Ingrese un DNI (8) o RUC (11) válido');
            return;
        }
        setError('');
        setSearching(true);
        try {
            const type = newClientData.dniRuc.length === 8 ? 'dni' : 'ruc';
            const { data } = await api.get(`/clients/consult/${type}/${newClientData.dniRuc}`);
            
            setNewClientData(prev => ({
                ...prev,
                nombres: data.nombres || '',
                direccion: data.direccion || prev.direccion,
                telefono: data.telefono || prev.telefono
            }));
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'No se encontró información');
        } finally {
            setSearching(false);
        }
  };

  const handleCreateClient = async () => {
      if (!newClientData.nombres || !newClientData.dniRuc) {
          setError('Nombre y DNI/RUC son obligatorios');
          return null;
      }
      try {
          setLoading(true);
          const { data } = await api.post('/clients', { ...newClientData, estado: true });
          
          setClientes(prev => [...prev, data]);
          setClienteId(String(data.id));
          
          setIsNewClientMode(false);
          setIsNewClientMode(false);
          setNewClientData({ nombres: '', dniRuc: '', telefono: '', direccion: '', email: '' });
          setError('');
          setError('');
          return data.id;
      } catch (err: any) {
          setError(err.response?.data?.error || 'Error al crear cliente');
          return null;
      } finally {
          setLoading(false);
      }
  };

  const handleSubmitSale = async () => {
    let finalClienteId = clienteId;

    if (isNewClientMode) {
        const newId = await handleCreateClient();
        if (!newId) return; 
        finalClienteId = String(newId);
    }

    if (metodoPago === 'EFECTIVO' && Number(montoRecibido) < total && montoRecibido !== '') {
        setError('El monto recibido es menor al total');
        return;
    }

    onConfirm({
        metodoPago,
        tipoComprobante,
        clienteId: finalClienteId ? Number(finalClienteId) : null,
        montoPago: montoRecibido ? Number(montoRecibido) : total
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gray-900 p-6 text-white relative shrink-0">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total a Cobrar</p>
                    <h2 className="text-4xl font-bold text-white">S/ {total.toFixed(2)}</h2>
                </div>
                {metodoPago === 'EFECTIVO' && montoRecibido && (
                     <div className="text-right">
                        <p className="text-gray-400 text-xs font-bold uppercase">Vuelto</p>
                        <p className="text-xl font-bold text-green-400">
                            S/ {Math.max(0, Number(montoRecibido) - total).toFixed(2)}
                        </p>
                     </div>
                )}
            </div>
        </div>

        {/* Body Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-bold">
                    Error: {error}
                </div>
            )}

            {/* SECCIÓN CLIENTE */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <User size={18} className="text-blue-600"/> 
                        {isNewClientMode ? 'Registrar Nuevo Cliente' : 'Seleccionar Cliente'}
                    </label>
                    <button 
                        onClick={() => setIsNewClientMode(!isNewClientMode)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                        {isNewClientMode ? <><ArrowLeft size={14}/> Volver</> : <><UserPlus size={14}/> Nuevo</>}
                    </button>
                </div>

                {isNewClientMode ? (
                    <div className="space-y-3 animate-in slide-in-from-right-5">
                        <div className="grid grid-cols-[2fr_1fr] gap-3"> 
                            <div className="flex gap-2">
                                <input 
                                    type="text" placeholder="DNI o RUC *"
                                    className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newClientData.dniRuc}
                                    onChange={e => setNewClientData({...newClientData, dniRuc: e.target.value})}
                                    maxLength={11}
                                />
                                <button 
                                    type="button"
                                    onClick={handleSearch}
                                    disabled={searching}
                                    className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                                    title="Buscar"
                                >
                                    <Search size={18} />
                                </button>
                            </div>
                             <input 
                                type="text" placeholder="Teléfono"
                                className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                value={newClientData.telefono}
                                onChange={e => setNewClientData({...newClientData, telefono: e.target.value})}
                            />
                        </div>
                        <input 
                            type="text" placeholder="Nombre Completo o Razón Social *"
                            className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={newClientData.nombres}
                            onChange={e => setNewClientData({...newClientData, nombres: e.target.value})}
                        />
                         <input 
                            type="text" placeholder="Dirección"
                            className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={newClientData.direccion}
                            onChange={e => setNewClientData({...newClientData, direccion: e.target.value})}
                        />
                         <input 
                            type="email" placeholder="Email (Opcional)"
                            className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={newClientData.email}
                            onChange={e => setNewClientData({...newClientData, email: e.target.value})}
                        />
                    </div>
                ) : (
                    <select 
                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                    >
                        <option value="">-- Público General (Sin DNI) --</option>
                        {clientes.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.nombres} {c.dniRuc ? `(${c.dniRuc})` : ''}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* TIPO COMPROBANTE */}
            <div className="grid grid-cols-2 gap-3">
                {['BOLETA', 'FACTURA'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setTipoComprobante(type)}
                        className={`py-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                            tipoComprobante === type 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <FileText size={16}/> {type}
                    </button>
                ))}
            </div>

            {/* MÉTODO DE PAGO */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Método de Pago</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: 'EFECTIVO', icon: Banknote, label: 'Efectivo' },
                        { id: 'TARJETA', icon: CreditCard, label: 'Tarjeta' },
                        { id: 'YAPE', icon: Wallet, label: 'Yape/Plin' },
                    ].map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setMetodoPago(method.id)}
                            className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all ${
                                metodoPago === method.id 
                                ? 'bg-green-50 border-green-500 text-green-700 ring-2 ring-green-500' 
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <method.icon size={20} />
                            <span className="text-xs font-bold">{method.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* CAMPO MONTO (Solo Efectivo) */}
            {metodoPago === 'EFECTIVO' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Monto Recibido</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400 font-bold">S/</span>
                        <input 
                            type="number" step="0.10"
                            placeholder={total.toFixed(2)}
                            className="w-full pl-8 border border-gray-300 rounded-xl p-3 text-lg font-bold text-gray-800 outline-none focus:ring-2 focus:ring-green-500"
                            value={montoRecibido}
                            onChange={e => setMontoRecibido(e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t shrink-0">
            <button 
                onClick={handleSubmitSale}
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70"
            >
                {loading ? 'Procesando...' : isNewClientMode ? 'Guardar Cliente y Cobrar' : 'Confirmar Venta'}
            </button>
        </div>
      </div>
    </div>
  );
};