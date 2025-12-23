import { useState } from "react";
import { UserModal } from "../components/UserModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { ToastNotification } from "../components/ToastNotification";
import { PasswordModal } from "../components/PasswordModal";
import { UsersHeader } from "../components/UsersHeader";
import { UsersTable } from "../components/UsersTable";
import { useUsers, type Usuario } from "../hooks/useUsers";

export const UsersPage = () => {
    // Hooks de Lógica
    const { 
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
    } = useUsers();

    // UI State Local
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    
    const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
    const [actionType, setActionType] = useState<"TOGGLE" | "DELETE" | null>(null);

    const handlePasswordClick = (user: Usuario) => {
        setSelectedUser(user);
        setIsPasswordModalOpen(true);
    };

    const handleToggleClick = (user: Usuario) => {
        setSelectedUser(user);
        setActionType("TOGGLE");
        setIsConfirmModalOpen(true);
    };

    const handleDeleteClick = (user: Usuario) => {
        setSelectedUser(user);
        setActionType("DELETE");
        setIsConfirmModalOpen(true);
    };

    const executeAction = async () => {
        if (!selectedUser || !actionType) return;

        if (actionType === "DELETE") {
            await handleDelete(selectedUser);
        } else if (actionType === "TOGGLE") {
            await handleToggleStatus(selectedUser);
        }
        setIsConfirmModalOpen(false);
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
            <UsersHeader 
                onNewUser={() => setIsCreateModalOpen(true)} 
            />

            <UsersTable 
                usuarios={usuarios}
                loading={loading}
                error={error}
                currentUser={currentUser}
                onPasswordClick={handlePasswordClick}
                onToggleClick={handleToggleClick}
                onDeleteClick={handleDeleteClick}
            />

            <UserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => { 
                    fetchUsers(); 
                    showToast("Usuario creado", "success"); 
                }}
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