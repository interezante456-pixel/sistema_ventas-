import { useState } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

interface UserDropdownProps {
    user: any;
}

export const UserDropdown = ({ user }: UserDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const logout = useAuthStore((state: any) => state.logout);

    const handleLogout = () => {
        if (logout) logout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="relative ml-auto">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all outline-none"
            >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-800 leading-none">{user.nombre}</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">{user.rol}</p>
                </div>

                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border border-blue-200 shadow-sm">
                    <User size={20} />
                </div>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>

                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-3 border-b bg-gray-50">
                            <p className="text-sm text-gray-500">Cuenta actual</p>
                            <p className="text-sm font-bold text-gray-900 truncate">{user.nombre}</p>
                        </div>

                        <div className="p-1">
                            <button
                                onClick={() => { setIsOpen(false); navigate('/profile'); }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <User size={16} /> Ver Perfil
                            </button>

                            <button
                                onClick={() => { setIsOpen(false); navigate('/settings'); }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <Settings size={16} /> Configuración
                            </button>
                        </div>

                        <div className="border-t p-1">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium"
                            >
                                <LogOut size={16} /> Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
