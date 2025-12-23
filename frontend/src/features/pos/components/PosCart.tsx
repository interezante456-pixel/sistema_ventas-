import { ShoppingCart, Trash2, Package, Minus, Plus } from "lucide-react";

interface PosCartProps {
    cart: any[];
    onRemove: (id: number) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
    onClear: () => void;
    onCheckout: () => void;
    total: number;
}

export const PosCart = ({ cart, onRemove, onUpdateQuantity, onClear, onCheckout, total }: PosCartProps) => {
    return (
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
                        <ShoppingCart size={48} className="mb-4 opacity-20" />
                        <p className="text-sm">El carrito está vacío.</p>
                        <p className="text-xs mt-1">
                            Selecciona productos para comenzar.
                        </p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex gap-3 group animate-in slide-in-from-left-2"
                        >
                            {/* Mini Imagen */}
                            <div className="w-12 h-12 bg-gray-100 rounded-md shrink-0 overflow-hidden">
                                {item.imagenUrl ? (
                                    <img
                                        src={item.imagenUrl}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Package className="m-auto text-gray-300 mt-3" size={20} />
                                )}
                            </div>

                            {/* Info y Controles */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-gray-800 text-sm truncate pr-2">
                                        {item.nombre}
                                    </h4>
                                    <button
                                        onClick={() => onRemove(item.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, -1)}
                                            className="p-1 hover:bg-white rounded shadow-sm hover:text-red-500 transition-all"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-bold w-4 text-center">
                                            {item.cantidad}
                                        </span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, 1)}
                                            className="p-1 hover:bg-white rounded shadow-sm hover:text-green-600 transition-all"
                                        >
                                            <Plus size={14} />
                                        </button>
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
                        S/ {total.toFixed(2)}
                    </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    <button
                        onClick={onClear}
                        disabled={cart.length === 0}
                        className="col-span-1 flex flex-col items-center justify-center p-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                        title="Vaciar Carrito"
                    >
                        <Trash2 size={20} />
                    </button>
                    <button
                        onClick={onCheckout}
                        disabled={cart.length === 0}
                        className="col-span-3 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                    >
                        Cobrar
                    </button>
                </div>
            </div>
        </div>
    );
};
