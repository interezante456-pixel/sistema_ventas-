import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut, Menu, FileText } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store"; // Asegúrate de importar tu store

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Lógica de Logout
  const logout = useAuthStore((state: any) => state.logout);
  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

 const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/pos", label: "Punto de Venta", icon: ShoppingCart }, // Coincide con path: "pos"
    { href: "/products", label: "Productos", icon: Package },      // Coincide con path: "products"
    { href: "/sales", label: "Historial Ventas", icon: FileText }, // Coincide con path: "sales"
    { href: "/users", label: "Usuarios", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-6 flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">SV</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Sistema Ventas</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
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
            onClick={handleLogout} // <--- AQUÍ CONECTAMOS LA LÓGICA
            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Mobile */}
        <header className="md:hidden bg-white p-4 flex items-center justify-between border-b shrink-0">
            <h1 className="font-bold text-gray-800">Sistema Ventas</h1>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="text-gray-600" />
            </button>
        </header>
        
        {/* Contenido con scroll independiente */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}