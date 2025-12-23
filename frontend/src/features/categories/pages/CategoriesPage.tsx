import { useState } from 'react';
import { CategoryModal } from '../components/CategoryModal';
import { ConfirmModal } from '../../users/components/ConfirmModal';
import { ToastNotification } from '../../users/components/ToastNotification';
import { CategoriesHeader } from '../components/CategoriesHeader';
import { CategoriesFilters } from '../components/CategoriesFilters';
import { CategoriesTable } from '../components/CategoriesTable';
import { useCategories } from '../hooks/useCategories';

export const CategoriesPage = () => {
    // Hooks de Lógica
    const {
        filteredCategories,
        loading,
        searchTerm,
        setSearchTerm,
        toast,
        setToast,
        fetchCategories,
        handleDelete
    } = useCategories();

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [catToDelete, setCatToDelete] = useState<number | null>(null);

    return (
        <div className="space-y-6">

            <CategoriesHeader 
                onNewCategory={() => {
                    setCategoryToEdit(null);
                    setIsModalOpen(true);
                }} 
            />

            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden max-w-4xl mx-auto md:mx-0">
                <CategoriesFilters 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                />

                <CategoriesTable 
                    categories={filteredCategories}
                    loading={loading}
                    onEdit={(cat) => {
                        setCategoryToEdit(cat);
                        setIsModalOpen(true);
                    }}
                    onDelete={(id) => {
                        setCatToDelete(id);
                        setIsConfirmOpen(true);
                    }}
                />
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchCategories}
                categoryToEdit={categoryToEdit}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={async () => {
                   if(catToDelete) {
                       await handleDelete(catToDelete);
                       setIsConfirmOpen(false);
                   }
                }}
                title="¿Eliminar Categoría?"
                message="Si eliminas esta categoría, asegúrate de que no tenga productos asociados."
                isDelete={true}
            />

            {toast && (
                <ToastNotification 
                    message={toast.msg} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
        </div>
    );
};