import { Menu } from "lucide-react";
import { UserDropdown } from "./UserDropdown";
import { useLocation } from "react-router-dom";
import { useNavigation } from "../../hooks/useNavigation";

interface NavbarProps {
    onMenuClick: () => void;
    user: any;
}

export const Navbar = ({ onMenuClick, user }: NavbarProps) => {
    const location = useLocation();
    const { navItems } = useNavigation();

    const currentTitle = navItems.find(i => location.pathname.startsWith(i.href))?.label || 'Dashboard';

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-40 relative">
            <button onClick={onMenuClick} className="md:hidden text-gray-600">
                <Menu size={24} />
            </button>

            <h2 className="hidden md:block text-lg font-semibold text-gray-700 capitalize">
                {currentTitle}
            </h2>

            <UserDropdown user={user} />
        </header>
    );
};
