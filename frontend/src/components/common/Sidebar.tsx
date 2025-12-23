import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Tags,
  ShoppingCart,
  FileText,
  LogOut,
  UserCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

export const Sidebar = () => {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'VENDEDOR', 'ALMACEN', 'CONTADOR']
    },
    {
      name: 'Usuarios',
      path: '/users',
      icon: UserCircle,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      name: 'Clientes',
      path: '/clients',
      icon: Users,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'VENDEDOR']
    },
    {
      name: 'Categorías',
      path: '/categories',
      icon: Tags,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'ALMACEN']
    },
    {
      name: 'Productos',
      path: '/products',
      icon: Package,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'ALMACEN', 'VENDEDOR']
    },
    {
      name: 'Punto de Venta',
      path: '/pos',
      icon: ShoppingCart,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'VENDEDOR']
    },
    {
      name: 'Historial Ventas',
      path: '/sales',
      icon: FileText,
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'VENDEDOR', 'CONTADOR']
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!user) return false;
    console.log(`Checking ${item.name} for role ${user.rol}. Allowed: ${item.allowedRoles}`);
    return item.allowedRoles.includes(user.rol);
  });

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col transition-all duration-300">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          SIVRA MARKET
        </h1>
      </div>

      {/* Menú */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Usuario */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-blue-400">
            {user?.nombre?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.nombre}</p>
            <p className="text-xs text-gray-500 truncate">{user?.rol}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};