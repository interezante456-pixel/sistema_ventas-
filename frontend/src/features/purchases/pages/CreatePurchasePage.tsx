import { useState } from 'react';
import { useProviders } from '../../providers/hooks/useProviders';
import { useProducts } from '../../products/hooks/useProducts';
import { usePurchases } from '../hooks/usePurchases';
import { useAuthStore } from '@/store/auth.store';
import { ArrowLeft, Plus, Trash2, Save, ShoppingCart, Search, User } from 'lucide-react';

interface CreatePurchasePageProps {
    onCancel: () => void;
}

interface CartItem {
    productoId: number;
    nombre: string;
    cantidad: number;
    precio: number;
    subtotal: number;
}

export const CreatePurchasePage = ({ onCancel }: CreatePurchasePageProps) => {
    const { providers } = useProviders();
    const { products } = useProducts();
    const { registerPurchase } = usePurchases();
    const user = useAuthStore(state => state.user);

    // Form State
    const [selectedProvider, setSelectedProvider] = useState<number | ''>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Cart State
    const [cart, setCart] = useState<CartItem[]>([]);
    
    // Product Selection State
    const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
    const [qty, setQty] = useState<string>('1');
    const [cost, setCost] = useState<string>('');
    const [searchProd, setSearchProd] = useState('');

    const [loading, setLoading] = useState(false);

    // Filter products for dropdown
    const filteredProducts = products.filter(p => 
        p.nombre.toLowerCase().includes(searchProd.toLowerCase()) || 
        p.codigo.toLowerCase().includes(searchProd.toLowerCase())
    );

    const handleAddItem = () => {
        if (!selectedProduct || !qty || !cost) return;
        
        const product = products.find(p => p.id === Number(selectedProduct));
        if (!product) return;

        const quantity = Number(qty);
        const price = Number(cost);

        if (quantity <= 0 || price < 0) return;

        const newItem: CartItem = {
            productoId: product.id,
            nombre: product.nombre,
            cantidad: quantity,
            precio: price,
            subtotal: quantity * price
        };

        setCart([...cart, newItem]);
        
        // Reset inputs
        setSelectedProduct('');
        setQty('1');
        setCost('');
        setSearchProd('');
    };

    const handleRemoveItem = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const handleSubmit = async () => {
        if (!selectedProvider || cart.length === 0 || !user) return;

        if (!confirm('¿Confirma registrar la compra? El stock se actualizará automáticamente.')) return;

        setLoading(true);
        const result = await registerPurchase({
            proveedorId: Number(selectedProvider),
            usuarioId: user.id || 1, 
            fechaCompra: date,
            detalles: cart.map(item => ({
                productoId: item.productoId,
                cantidad: item.cantidad,
                precio: item.precio
            }))
        });

        if (result.success) {
            onCancel(); // Go back to list
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Nueva Compra</h1>
                    <p className="text-gray-500">Registrar ingreso de mercadería</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT: Form & Cart */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Header Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <User size={18} /> Datos del Proveedor
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    value={selectedProvider}
                                    onChange={e => setSelectedProvider(Number(e.target.value))}
                                >
                                    <option value="">-- Seleccionar Proveedor --</option>
                                    {providers.map(prov => (
                                        <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Emisión</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Adder */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
                         <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <ShoppingCart size={18} /> Agregar Productos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-5 relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Producto</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                    <input 
                                        type="text" 
                                        className="pl-9 w-full border border-gray-300 rounded-lg p-2 text-sm"
                                        placeholder="Escribe para buscar..."
                                        value={searchProd}
                                        onChange={e => setSearchProd(e.target.value)}
                                    />
                                </div>
                                {searchProd && (
                                    <div className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {filteredProducts.map(p => (
                                            <button
                                                key={p.id}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                                onClick={() => {
                                                    setSelectedProduct(p.id);
                                                    setSearchProd(p.nombre);
                                                    // Optional: setCost(p.precioCompra) to autofill
                                                }}
                                            >
                                                {p.codigo} - {p.nombre}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    min="1"
                                    value={qty}
                                    onChange={e => setQty(e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Costo Unit. (S/)</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    min="0"
                                    step="0.01"
                                    value={cost}
                                    onChange={e => setCost(e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    onClick={handleAddItem}
                                    disabled={!selectedProduct || !qty || !cost}
                                    className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex justify-center"
                                >
                                    <Plus size={24} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Cart Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Producto</th>
                                    <th className="px-6 py-3 text-center">Cant.</th>
                                    <th className="px-6 py-3 text-right">Costo</th>
                                    <th className="px-6 py-3 text-right">Subtotal</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {cart.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="px-6 py-4 font-medium">{item.nombre}</td>
                                        <td className="px-6 py-4 text-center">{item.cantidad}</td>
                                        <td className="px-6 py-4 text-right">S/ {item.precio.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right font-semibold">S/ {item.subtotal.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleRemoveItem(idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {cart.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                            Agrega productos a la compra
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT: Summary */}
                <div className="lg:col-span-1">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Resumen</h3>
                        
                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>Items:</span>
                                <span>{cart.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Unidades Totales:</span>
                                <span>{cart.reduce((a,b) => a + b.cantidad, 0)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-8">
                            <span className="text-xl font-bold text-gray-800">Total</span>
                            <span className="text-2xl font-bold text-blue-600">S/ {total.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || cart.length === 0 || !selectedProvider}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:bg-gray-300 flex justify-center items-center gap-2"
                        >
                            <Save size={20} />
                            {loading ? 'Procesando...' : 'Guardar Compra'}
                        </button>

                        {!selectedProvider && (
                            <p className="text-xs text-red-500 text-center mt-2">Selecciona un proveedor para continuar</p>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};
