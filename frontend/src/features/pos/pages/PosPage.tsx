import { useState, useEffect } from "react";
import { ToastNotification } from "../../users/components/ToastNotification";
import { PaymentModal } from "../components/PaymentModal";
import { SaleSuccessModal } from "../components/SaleSuccessModal";
import { PosCatalog } from "../components/PosCatalog";
import { PosCart } from "../components/PosCart";
import { useCart } from "../hooks/useCart";
import { usePos } from "../hooks/usePos";
import { usePosSales } from "../hooks/usePosSales";

export const PosPage = () => {
    // Hooks de Lógica
    const {
        filteredProducts,
        categories,
        loading,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        refreshProducts,
        posError
    } = usePos();

    const {
        cart,
        cartError,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotal
    } = useCart();

    // UI State Local
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [lastSale, setLastSale] = useState<any>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    // Manejo de Venta
    const handleSuccess = (createdSale: any) => {
        setLastSale(createdSale);
        setIsPaymentOpen(false);
        setIsSuccessOpen(true);
        clearCart();
        refreshProducts(); // Actualizar stock
    };

    const handleError = (msg: string) => {
        setToast({ msg, type: 'error' });
    };

    const { processSale } = usePosSales(cart, calculateTotal, handleSuccess, handleError);

    // Sync hook errors with toast
    useEffect(() => {
        if (cartError) setToast({ msg: cartError, type: 'error' });
    }, [cartError]);

    useEffect(() => {
        if (posError) setToast({ msg: posError, type: 'error' });
    }, [posError]);

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-4 md:gap-6">

            <PosCatalog
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                loading={loading}
                products={filteredProducts}
                onAddToCart={addToCart}
            />

            <PosCart
                cart={cart}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onClear={clearCart}
                onCheckout={() => setIsPaymentOpen(true)}
                total={calculateTotal()}
            />

            {/* Modales */}
            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                onConfirm={processSale}
                total={calculateTotal()}
            />

            <SaleSuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                sale={lastSale}
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
