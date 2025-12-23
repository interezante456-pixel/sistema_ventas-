import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
    href: string;
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
}

export const SidebarItem = ({ href, label, icon: Icon, onClick }: SidebarItemProps) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(href);

    return (
        <Link
            to={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                    ? "bg-blue-50 text-blue-700 font-medium shadow-sm ring-1 ring-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
            <Icon size={20} />
            {label}
        </Link>
    );
};
