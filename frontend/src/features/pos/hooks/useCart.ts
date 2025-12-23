import { useState } from 'react';

export const useCart = () => {
    const [cart, setCart] = useState<any[]>([]);
    const [cartError, setCartError] = useState<string | null>(null);

    const addToCart = (product: any) => {
        // 1. Validar Stock
        const itemInCart = cart.find((item) => item.id === product.id);
        const currentQty = itemInCart ? itemInCart.cantidad : 0;

        if (currentQty + 1 > product.stock) {
            setCartError(`¡Stock insuficiente! Solo quedan ${product.stock}`);
            // Limpiamos el error después de 3 seg o dejamos que el componente lo maneje
            setTimeout(() => setCartError(null), 3000);
            return;
        }

        // 2. Agregar o actualizar
        setCart((prev) => {
            if (itemInCart) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prev, { ...product, cantidad: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = item.cantidad + delta;
                    // Validaciones
                    if (newQty < 1) return item;
                    if (newQty > item.stock) {
                        setCartError("No hay más stock disponible");
                        setTimeout(() => setCartError(null), 3000);
                        return item;
                    }
                    return { ...item, cantidad: newQty };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const calculateTotal = () => {
        return cart.reduce(
            (total, item) => total + Number(item.precioVenta) * item.cantidad,
            0
        );
    };

    return {
        cart,
        cartError,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotal,
    };
};
