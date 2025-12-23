import { useState, useEffect } from 'react';
import api from '../../../config/api';

export interface Usuario {
    id: number;
    nombre: string;
    usuario: string;
    rol: "ADMIN" | "VENDEDOR" | "ALMACEN";
    estado: boolean;
}

export const useUsers = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Recuperamos el usuario actual para evitar que se borre a sí mismo
    const userString = localStorage.getItem('user');
    const currentUser = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/users");
            setUsuarios(data);
        } catch (err) {
            console.error(err);
            setError("Error al cargar usuarios.");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };

    const handleToggleStatus = async (user: Usuario) => {
        if (currentUser && user.id === currentUser.id) {
            showToast("No puedes desactivar tu propia cuenta", "error");
            return false;
        }
        try {
            await api.patch(`/users/${user.id}`, { estado: !user.estado });
            showToast(`Usuario ${user.estado ? 'desactivado' : 'activado'} correctamente`, "success");
            fetchUsers();
            return true;
        } catch (err) {
            showToast("Error al procesar la solicitud", "error");
            return false;
        }
    };

    const handleDelete = async (user: Usuario) => {
        if (currentUser && user.id === currentUser.id) {
            showToast("No puedes eliminar tu propia cuenta", "error");
            return false;
        }

        try {
            await api.delete(`/users/${user.id}`);
            showToast("Usuario eliminado permanentemente", "success");
            fetchUsers();
            return true;
        } catch (err) {
            showToast("Error al eliminar usuario", "error");
            return false;
        }
    };

    return {
        usuarios,
        loading,
        error,
        currentUser,
        toast,
        setToast,
        showToast,
        fetchUsers,
        handleToggleStatus,
        handleDelete
    };
};
