import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  LogOut, 
  Menu, 
  User, 
  FileText, 
  Settings 
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store"; 

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { nombre: 'Usuario', rol: 'Invitado' };

  const logout = useAuthStore((state: any) => state.logout);

  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/pos", label: "Punto de Venta", icon: ShoppingCart },
    { href: "/products", label: "Productos", icon: Package },
    { href: "/sales", label: "Historial Ventas", icon: FileText },
    { href: "/users", label: "Usuarios", icon: Users },
    { href: "/categories", label: "Categorías", icon: Package },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-2 h-16 border-b md:border-none">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">SV</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Sistema Ventas</h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden ml-auto text-gray-500">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
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

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-40 relative">
            
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600">
                <Menu size={24} />
            </button>

            <h2 className="hidden md:block text-lg font-semibold text-gray-700 capitalize">
                {navItems.find(i => i.href === location.pathname)?.label || 'Dashboard'}
            </h2>

            {/* 👇 PERFIL (Nombre + Avatar) */}
            <div className="relative ml-auto">
                
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    // Flex para alinear nombre y avatar horizontalmente
                    className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all outline-none"
                >
                    {/* 👇 AQUÍ ESTÁ EL NOMBRE QUE PEDISTE DEJAR 👇 */}
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800 leading-none">{user.nombre}</p>
                        <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">{user.rol}</p>
                    </div>

                    {/* El Avatar */}
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border border-blue-200 shadow-sm">
                        <User size={20} />
                    </div>
                </button>

                {/* MENÚ DESPLEGABLE */}
                {isProfileOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>

                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            
                            {/* Cabecera interna del menú */}
                            <div className="px-4 py-3 border-b bg-gray-50">
                                <p className="text-sm text-gray-500">Cuenta actual</p>
                                <p className="text-sm font-bold text-gray-900 truncate">{user.nombre}</p>
                            </div>

                            <div className="p-1">
                                <button 
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        // Futura navegación
                                    }}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    <User size={16} />
                                    Ver Perfil
                                </button>
                                
                                <button 
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        // Futura configuración
                                    }}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    <Settings size={16} />
                                    Configuración
                                </button>
                            </div>

                            <div className="border-t p-1">
                                <button 
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium"
                                >
                                    <LogOut size={16} />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-100">
          <Outlet />
        </div>
      </main>

      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}