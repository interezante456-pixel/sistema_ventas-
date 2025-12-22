import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, Package, XCircle } from 'lucide-react';
import api from '../../../config/api';
import { ToastNotification } from '../../users/components/ToastNotification';
import { PaymentModal } from '../components/PaymentModal';

export const PosPage = () => {
  // Estados de datos
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  
  // Estados de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // Cargar productos y categorías al inicio
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setToast({ msg: 'Error al cargar el catálogo', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- LÓGICA DEL CARRITO ---

  const addToCart = (product: any) => {
    // 1. Validar Stock
    const itemInCart = cart.find(item => item.id === product.id);
    const currentQty = itemInCart ? itemInCart.cantidad : 0;
    
    if (currentQty + 1 > product.stock) {
        setToast({ msg: `¡Stock insuficiente! Solo quedan ${product.stock}`, type: 'error' });
        return;
    }

    // 2. Agregar o actualizar
    setCart(prev => {
      if (itemInCart) {
        return prev.map(item => 
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.cantidad + delta;
        // Validaciones
        if (newQty < 1) return item; 
        if (newQty > item.stock) {
           setToast({ msg: 'No hay más stock disponible', type: 'error' });
           return item;
        }
        return { ...item, cantidad: newQty };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (Number(item.precioVenta) * item.cantidad), 0);
  };

  // --- PROCESAR VENTA ---

  const handleProcessSale = async (paymentData: any) => {
    try {
        // 1. Construir el payload que espera el Backend (SalesService.create)
        const payload = {
            tipoComprobante: paymentData.tipoComprobante,
            clienteId: paymentData.clienteId, // Puede ser null
            metodoPago: paymentData.metodoPago,
            montoPago: paymentData.montoPago,
            total: calculateTotal(),
            detalles: cart.map(item => ({
                productoId: item.id,
                cantidad: item.cantidad,
                precio: Number(item.precioVenta),
                subtotal: Number(item.precioVenta) * item.cantidad
            }))
        };

        // 2. Enviar al Backend
        await api.post('/sales', payload);

        // 3. Limpiar y notificar
        setToast({ msg: '¡Venta registrada correctamente! 🎉', type: 'success' });
        setCart([]);
        setIsPaymentOpen(false);
        
        // 4. Recargar productos para actualizar el stock visualmente
        const { data } = await api.get('/products');
        setProducts(data);

    } catch (error: any) {
        console.error(error);
        setToast({ 
            msg: error.response?.data?.error || 'Error al procesar la venta', 
            type: 'error' 
        });
    }
  };

  // Filtrado de productos visual
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.codigo.includes(searchTerm);
    const matchesCategory = selectedCategory ? p.categoriaId === selectedCategory : true;
    return matchesSearch && matchesCategory && p.estado; // Solo mostrar activos
  });

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-4 md:gap-6">
      
      {/* --- COLUMNA IZQUIERDA: CATÁLOGO (65%) --- */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden order-2 md:order-1">
        
        {/* Header Filtros */}
        <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              className="pl-10 w-full border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none"
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Todas las Categorías</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        {/* Grilla Productos */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
            {loading ? (
                <div className="flex justify-center items-center h-full text-gray-400">Cargando...</div>
            ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Package size={48} className="mb-2 opacity-50"/>
                    <p>No se encontraron productos</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                        <button 
                            key={product.id}
                            onClick={() => addToCart(product)}
                            disabled={product.stock <= 0}
                            className={`group flex flex-col bg-white rounded-xl shadow-sm border hover:shadow-md transition-all overflow-hidden text-left relative ${
                                product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'
                            }`}
                        >
                            {/* Stock Badge */}
                            <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-full z-10 ${
                                product.stock <= 5 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                                Stock: {product.stock}
                            </span>

                            {/* Imagen */}
                            <div className="aspect-square bg-gray-50 w-full relative">
                                {product.imagenUrl ? (
                                    <img src={product.imagenUrl} alt="" className="w-full h-full object-cover"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Package size={32}/>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <h3 className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[40px] leading-tight">
                                    {product.nombre}
                                </h3>
                                <p className="text-blue-600 font-bold mt-1">
                                    S/ {Number(product.precioVenta).toFixed(2)}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* --- COLUMNA DERECHA: TICKET (35%) --- */}
      <div className="w-full md:w-[350px] lg:w-[400px] flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden order-1 md:order-2 h-[40vh] md:h-auto">
        <div className="bg-gray-800 text-white p-4 flex items-center gap-2 shadow-sm">
            <ShoppingCart size={20} />
            <h2 className="font-bold">Ticket de Venta</h2>
            <span className="ml-auto bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                {cart.length} items
            </span>
        </div>

        {/* Lista del Carrito */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <ShoppingCart size={48} className="mb-4 opacity-20"/>
                    <p className="text-sm">El carrito está vacío.</p>
                    <p className="text-xs mt-1">Selecciona productos para comenzar.</p>
                </div>
            ) : (
                cart.map(item => (
                    <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex gap-3 group animate-in slide-in-from-left-2">
                         {/* Mini Imagen */}
                        <div className="w-12 h-12 bg-gray-100 rounded-md shrink-0 overflow-hidden">
                             {item.imagenUrl ? (
                                 <img src={item.imagenUrl} className="w-full h-full object-cover"/>
                             ) : <Package className="m-auto text-gray-300 mt-3" size={20}/>}
                        </div>
                        
                        {/* Info y Controles */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-800 text-sm truncate pr-2">{item.nombre}</h4>
                                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm hover:text-red-500 transition-all"><Minus size={14}/></button>
                                    <span className="text-sm font-bold w-4 text-center">{item.cantidad}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm hover:text-green-600 transition-all"><Plus size={14}/></button>
                                </div>
                                <p className="font-bold text-gray-900">
                                    S/ {(Number(item.precioVenta) * item.cantidad).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer Totales */}
        <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-medium">Total a Pagar</span>
                <span className="text-3xl font-bold text-blue-600">
                    S/ {calculateTotal().toFixed(2)}
                </span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
                <button 
                    onClick={() => setCart([])}
                    disabled={cart.length === 0}
                    className="col-span-1 flex flex-col items-center justify-center p-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    title="Vaciar Carrito"
                >
                    <Trash2 size={20} />
                </button>
                <button 
                    onClick={() => setIsPaymentOpen(true)}
                    disabled={cart.length === 0}
                    className="col-span-3 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                >
                    Cobrar
                </button>
            </div>
        </div>
      </div>

      {/* Modales */}
      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={handleProcessSale}
        total={calculateTotal()}
      />

      {toast && <ToastNotification message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};