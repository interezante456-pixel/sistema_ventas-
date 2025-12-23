import { LogOut } from "lucide-react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarItem } from "./SidebarItem";
import { useNavigation } from "../../hooks/useNavigation";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

interface SidebarProps {
    isMobileOpen: boolean;
    onCloseMobile: () => void;
}

export const Sidebar = ({ isMobileOpen, onCloseMobile }: SidebarProps) => {
    const { navItems } = useNavigation();
    const navigate = useNavigate();
    const logout = useAuthStore((state: any) => state.logout);

    const handleLogout = () => {
        if (logout) logout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <SidebarHeader onCloseMobile={onCloseMobile} />

            <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
                {navItems.map((item) => (
                    <SidebarItem
                        key={item.href}
                        {...item}
                        onClick={onCloseMobile}
                    />
                ))}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};
