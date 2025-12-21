import { useEffect, useState } from "react";
import api from "../../../config/api";
import { User, Shield, Trash2, UserPlus, RefreshCcw } from "lucide-react"; // <--- Asegúrate de tener RefreshCcw
import { UserModal } from "../components/UserModal";

interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  rol: "ADMIN" | "VENDEDOR" | "ALMACEN";
  estado: boolean;
}

export const UsersPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const { data } = await api.get("/users");
      setUsuarios(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  // 👇 LÓGICA NUEVA: Alternar entre Activar y Desactivar
  const toggleStatus = async (id: number, estadoActual: boolean) => {
    const accion = estadoActual ? "desactivar" : "activar";
    
    // 1. Pregunta de confirmación
    const confirmar = window.confirm(
      `¿Deseas ${accion} este usuario?`
    );

    if (!confirmar) return;

    try {
      if (estadoActual) {
        // Si está activo, lo desactivamos (DELETE lógico)
        await api.delete(`/users/${id}`);
      } else {
        // Si está inactivo, lo reactivamos (PATCH)
        await api.patch(`/users/${id}`, { estado: true });
      }

      // 2. Mensaje de éxito
      alert(`✅ Usuario ${estadoActual ? 'desactivado' : 'activado'} correctamente`);

      // Recargamos la tabla
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert(`❌ Hubo un error al intentar ${accion} el usuario`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-500">Administra el acceso al sistema.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <UserPlus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-sm">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {usuarios.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <User size={18} />
                    </div>
                    {user.nombre}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.usuario}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        user.rol === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : user.rol === "VENDEDOR"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <Shield size={12} />
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.estado
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* 👇 BOTÓN INTELIGENTE: Cambia según el estado */}
                    <button
                      onClick={() => toggleStatus(user.id, user.estado)}
                      className={`transition-colors p-2 rounded-full border
                        ${user.estado 
                          ? 'text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200' 
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50 hover:border-green-200'
                        }`}
                      title={user.estado ? "Desactivar Usuario" : "Reactivar Usuario"}
                    >
                      {/* Si está activo mostramos Basura, si no, mostramos Flecha */}
                      {user.estado ? <Trash2 size={18} /> : <RefreshCcw size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsuarios}
      />
    </div>
  );
};