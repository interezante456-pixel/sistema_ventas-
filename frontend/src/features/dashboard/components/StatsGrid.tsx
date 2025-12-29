import { DollarSign, ShoppingBag, Users, AlertTriangle } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    colorClass: string;
}

const StatCard = ({ title, value, icon, colorClass }: StatCardProps) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
                {icon}
            </div>
        </div>
    </div>
);

interface StatsGridProps {
    stats: {
        salesTotal: number;
        ordersCount: number;
        activeClients: number;
        lowStock: number;
    };
    onLowStockClick?: () => void;
}

export const StatsGrid = ({ stats, onLowStockClick }: StatsGridProps) => {
    const statItems = [
        {
            title: "Ventas Totales",
            value: `S/ ${Number(stats.salesTotal || 0).toFixed(2)}`,
            icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
            colorClass: "bg-emerald-100",
            onClick: undefined
        },
        {
            title: "Pedidos",
            value: Number(stats.ordersCount || 0).toString(),
            icon: <ShoppingBag className="w-6 h-6 text-blue-600" />,
            colorClass: "bg-blue-100",
            onClick: undefined
        },
        {
            title: "Clientes Activos",
            value: Number(stats.activeClients || 0).toString(),
            icon: <Users className="w-6 h-6 text-indigo-600" />,
            colorClass: "bg-indigo-100",
            onClick: undefined
        },
        {
            title: "Stock Bajo",
            value: `${stats.lowStock} Items`,
            icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
            colorClass: "bg-amber-100",
            onClick: onLowStockClick
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((stat, index) => (
                <div
                    key={index}
                    onClick={stat.onClick}
                    className={`${stat.onClick ? 'cursor-pointer transform hover:scale-105 transition-all duration-200' : ''}`}
                >
                    <StatCard
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        colorClass={stat.colorClass}
                    />
                </div>
            ))}
        </div>
    );
};
