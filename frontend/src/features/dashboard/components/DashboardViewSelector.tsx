import { LayoutDashboard, Users, Calculator, Package, User } from "lucide-react";

export type DashboardViewMode = 'GLOBAL' | 'ACCOUNTANT' | 'SELLER' | 'WAREHOUSE';

interface DashboardViewSelectorProps {
    currentView: DashboardViewMode;
    onViewChange: (view: DashboardViewMode) => void;
    users: any[];
    selectedUserId?: number;
    onUserSelect: (id: number) => void;
}

export const DashboardViewSelector = ({ 
    currentView, 
    onViewChange, 
    users, 
    selectedUserId, 
    onUserSelect 
}: DashboardViewSelectorProps) => {
    
    const views = [
        { id: 'GLOBAL', label: 'Global', icon: LayoutDashboard },
        { id: 'ACCOUNTANT', label: 'Contador', icon: Calculator },
        { id: 'WAREHOUSE', label: 'Almacén', icon: Package },
        { id: 'SELLER', label: 'Vendedor', icon: Users },
    ];

    const sellers = users.filter(u => u.rol === 'VENDEDOR' || u.rol === 'ADMIN' || u.rol === 'SUPER_ADMIN');

    return (
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex bg-gray-100 p-1 rounded-lg">
                {views.map((view) => {
                    const Icon = view.icon;
                    const isActive = currentView === view.id;
                    return (
                        <button
                            key={view.id}
                            onClick={() => onViewChange(view.id as DashboardViewMode)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                isActive 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Icon size={16} />
                            {view.label}
                        </button>
                    );
                })}
            </div>

            {currentView === 'SELLER' && (
                <div className="flex items-center gap-2 w-full sm:w-auto animate-fadeIn">
                    <User size={16} className="text-gray-500" />
                    <select
                        value={selectedUserId || ''}
                        onChange={(e) => onUserSelect(Number(e.target.value))}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-64 p-2.5"
                    >
                        <option value="">Seleccionar Usuario...</option>
                        {sellers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.nombre} ({user.usuario})
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};
