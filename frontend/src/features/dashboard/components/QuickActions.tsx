import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export const QuickActions = () => {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const isVendor = user?.rol === 'VENDEDOR';

    const actions = [
        {
            label: "Nueva Venta",
            icon: <ShoppingCart className="w-5 h-5" />,
            color: "bg-blue-600 hover:bg-blue-700 text-white",
            onClick: () => navigate("/pos"),
            allowed: true
        },
        {
            label: "Agregar Producto",
            icon: <Plus className="w-5 h-5" />,
            color: "bg-emerald-600 hover:bg-emerald-700 text-white",
            onClick: () => navigate("/products"),
            allowed: !isVendor // Ocultar si es vendedor
        },
        {
            label: "Registrar Cliente",
            icon: <UserPlus className="w-5 h-5" />,
            color: "bg-purple-600 hover:bg-purple-700 text-white",
            onClick: () => navigate("/clients"),
            allowed: true
        },
    ];

    const visibleActions = actions.filter(a => a.allowed);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Acciones Rápidas</h3>
            <div className={`grid grid-cols-1 gap-3 ${visibleActions.length === 1 ? '' : ''}`}>
                {visibleActions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium transition-colors ${action.color}`}
                    >
                        {action.icon}
                        {action.label}
                    </button>
                ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 text-center">
                    Sistema actualizado hoy a las 09:00 AM
                </p>
            </div>
        </div>
    );
};
