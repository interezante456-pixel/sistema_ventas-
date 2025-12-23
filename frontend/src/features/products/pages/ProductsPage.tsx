import { useState } from 'react';
import { ProductModal } from '../components/ProductModal';
import { ConfirmModal } from '../../users/components/ConfirmModal';
import { ToastNotification } from '../../users/components/ToastNotification';
import { ProductViewModal } from '../components/ProductViewModal';
import { ProductsHeader } from '../components/ProductsHeader';
import { ProductsFilters } from '../components/ProductsFilters';
import { ProductsTable } from '../components/ProductsTable';
import { useProducts } from '../hooks/useProducts';

export const ProductsPage = () => {
    const {
        filteredProducts,
        loading,
        searchTerm,
        setSearchTerm,
        toast,
        setToast,
        fetchProducts,
        handleDeleteOrRestore
    } = useProducts();

    // Modales UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<any>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [productToView, setProductToView] = useState<any>(null);

    return (
        <div className="space-y-6">

            <ProductsHeader
                onNewProduct={() => {
                    setProductToEdit(null);
                    setIsModalOpen(true);
                }}
            />

            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                <ProductsFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />

                <ProductsTable
                    products={filteredProducts}
                    loading={loading}
                    onView={(product) => {
                        setProductToView(product);
                        setIsViewOpen(true);
                    }}
                    onEdit={(product) => {
                        setProductToEdit(product);
                        setIsModalOpen(true);
                    }}
                    onDelete={(product) => {
                        setProductToDelete(product);
                        setIsConfirmOpen(true);
                    }}
                />
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchProducts}
                productToEdit={productToEdit}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={async () => {
                    await handleDeleteOrRestore(productToDelete);
                    setIsConfirmOpen(false);
                }}
                title={productToDelete?.estado ? "¿Eliminar Producto?" : "¿Restaurar Producto?"}
                message={productToDelete?.estado
                    ? "El producto pasará a inactivos."
                    : "El producto volverá a estar activo."}
                isDelete={productToDelete?.estado}
            />

            <ProductViewModal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                product={productToView}
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