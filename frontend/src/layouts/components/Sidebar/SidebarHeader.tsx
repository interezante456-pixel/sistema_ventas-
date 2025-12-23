import { Menu } from "lucide-react";

interface SidebarHeaderProps {
    onCloseMobile: () => void;
}

export const SidebarHeader = ({ onCloseMobile }: SidebarHeaderProps) => {
    return (
        <div className="p-6 flex items-center gap-2 h-16 border-b md:border-none">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SV</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Sistema Ventas</h1>
            <button onClick={onCloseMobile} className="md:hidden ml-auto text-gray-500">
                <Menu size={20} />
            </button>
        </div>
    );
};
