import { useEffect, useState } from "react";
import api from "../../../config/api";
import { User, Shield, UserPlus, Power, Trash2, KeyRound } from "lucide-react";
import { UserModal } from "../components/UserModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { ToastNotification } from "../components/ToastNotification";
import { PasswordModal } from "../components/PasswordModal";

interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  rol: "ADMIN" | "VENDEDOR" | "ALMACEN";
  estado: boolean;
}

interface ToastState {
  message: string;
  type: "success" | "error";
}

export const UsersPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Recuperamos el usuario actual para evitar que se borre a sí mismo
  const userString = localStorage.getItem('user');
  const currentUser = userString ? JSON.parse(userString) : null;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<{id: number, nombre: string, estado: boolean} | null>(null);
  const [actionType, setActionType] = useState<"TOGGLE" | "DELETE" | null>(null);

  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
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

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handlePasswordClick = (user: Usuario) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleToggleClick = (user: Usuario) => {
    // Protección extra (aunque el botón estará deshabilitado)
    if (currentUser && user.id === currentUser.id) {
        showToast("No puedes desactivar tu propia cuenta", "error");
        return;
    }
    setSelectedUser(user);
    setActionType("TOGGLE");
    setIsConfirmModalOpen(true);
  };

  const handleDeleteClick = (user: Usuario) => {
    if (currentUser && user.id === currentUser.id) {
        showToast("No puedes eliminar tu propia cuenta", "error");
        return;
    }
    setSelectedUser(user);
    setActionType("DELETE");
    setIsConfirmModalOpen(true);
  };

  const executeAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      if (actionType === "DELETE") {
        await api.delete(`/users/${selectedUser.id}`);
        showToast("Usuario eliminado permanentemente", "success");
      } 
      else if (actionType === "TOGGLE") {
        await api.patch(`/users/${selectedUser.id}`, { estado: !selectedUser.estado });
        showToast(`Usuario ${selectedUser.estado ? 'desactivado' : 'activado'} correctamente`, "success");
      }
      
      fetchProducts();
    } catch (err) {
      showToast("Error al procesar la solicitud", "error");
    }
  };

  const getConfirmContent = () => {
    if (actionType === "DELETE") {
      return {
        title: "¿Eliminar Definitivamente?",
        message: `Estás a punto de borrar a "${selectedUser?.nombre}". Esta acción NO se puede deshacer.`,
        isDelete: true
      };
    }
    const isDesactivating = selectedUser?.estado;
    return {
      title: isDesactivating ? "¿Desactivar Usuario?" : "¿Reactivar Usuario?",
      message: isDesactivating 
        ? "El usuario perderá acceso al sistema." 
        : "El usuario recuperará su acceso al sistema.",
      isDelete: isDesactivating
    };
  };

  const confirmContent = getConfirmContent();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-gray-500">Administra el acceso al sistema.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
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
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {usuarios.map((user) => {
                // 👇 VERIFICAMOS SI ES EL USUARIO ACTUAL
                const isCurrentUser = currentUser && user.id === currentUser.id;

                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isCurrentUser ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                        <User size={18} />
                      </div>
                      <div>
                        {user.nombre}
                        {isCurrentUser && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">(Tú)</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.usuario}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.rol === "ADMIN" ? "bg-purple-100 text-purple-800" : 
                          user.rol === "VENDEDOR" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        <Shield size={12} />
                        {user.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.estado ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {user.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        
                        {/* 1. RESET PASSWORD (Siempre permitido) */}
                        <button
                          onClick={() => handlePasswordClick(user)}
                          className="p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                          title="Cambiar Contraseña"
                        >
                          <KeyRound size={18} />
                        </button>

                        {/* 2. TOGGLE (Bloqueado si eres tú) */}
                        <button
                          onClick={() => handleToggleClick(user)}
                          disabled={isCurrentUser} // ⛔ BLOQUEO
                          className={`p-2 rounded-full transition-colors ${
                            isCurrentUser ? 'opacity-30 cursor-not-allowed text-gray-400' : // Estilo bloqueado
                            user.estado 
                              ? "text-blue-400 hover:text-blue-600 hover:bg-blue-50" 
                              : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                          }`}
                          title={isCurrentUser ? "No puedes desactivarte a ti mismo" : (user.estado ? "Desactivar" : "Activar")}
                        >
                          <Power size={18} />
                        </button>

                        {/* 3. HARD DELETE (Bloqueado si eres tú) */}
                        <button
                          onClick={() => handleDeleteClick(user)}
                          disabled={isCurrentUser} // ⛔ BLOQUEO
                          className={`p-2 rounded-full transition-colors ${
                            isCurrentUser ? 'opacity-30 cursor-not-allowed text-gray-400' : // Estilo bloqueado
                            "text-gray-400 hover:text-red-600 hover:bg-red-50"
                          }`}
                          title={isCurrentUser ? "No puedes eliminarte a ti mismo" : "Eliminar permanentemente"}
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <UserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => { fetchProducts(); showToast("Usuario creado", "success"); }}
      />

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userId={selectedUser?.id || null}
        onSuccess={() => showToast("Contraseña actualizada", "success")}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={executeAction}
        title={confirmContent.title}
        message={confirmContent.message}
        isDelete={confirmContent.isDelete || false}
      />

      {toast && (
        <ToastNotification 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};