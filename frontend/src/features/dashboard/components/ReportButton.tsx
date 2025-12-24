import type { LucideIcon } from "lucide-react";

interface ReportButtonProps {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    onClick?: () => void;
}

export const ReportButton = ({ title, description, icon: Icon, color, onClick }: ReportButtonProps) => {
    return (
        <button 
            onClick={onClick}
            className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group"
        >
            <div className={`p-3 rounded-lg ${color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{title}</h4>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
        </button>
    );
};
