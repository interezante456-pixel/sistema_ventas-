import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    FileText,
    Tags,
    User
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export const useNavigation = () => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { nombre: 'Usuario', rol: 'Invitado' };

    const navItems = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'VENDEDOR', 'ALMACEN', 'CONTADOR']
        },
        {
            href: "/users",
            label: "Usuarios",
            icon: User,
            allowedRoles: ['SUPER_ADMIN', 'ADMIN']
        },
        {
            href: "/clients",
            label: "Clientes",
            icon: Users,
            allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'VENDEDOR']
        },
        {
            href: "/categories",
            label: "Categorías",
            icon: Tags,
            allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'ALMACEN']
        },
        {
            href: "/products",
            label: "Productos",
            icon: Package,
            allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'ALMACEN']
        },
        {
            href: "/pos",
            label: "Punto de Venta",
            icon: ShoppingCart,
            allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'VENDEDOR']
        },
        {
            href: "/sales",
            label: "Historial Ventas",
            icon: FileText,
            allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'VENDEDOR', 'CONTADOR']
        },
    ];

    const filteredNavItems = navItems.filter(item =>
        user && item.allowedRoles.includes(user.rol)
    );

    return {
        navItems: filteredNavItems,
        user
    };
};
