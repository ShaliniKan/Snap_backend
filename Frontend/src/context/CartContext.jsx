import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
    addToCart,
    getCart,
    removeCartItem,
    updateCartItemQuantity,
} from "../services/cartService";

const CartContext = createContext(null);

const emptyCart = {
    items: [],
    total_amount: 0,
};

export const buildCartProductKey = ({ productId, variantId }) => `${productId}:${variantId || "none"}`;

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(emptyCart);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [addingProductKey, setAddingProductKey] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [updatingItemId, setUpdatingItemId] = useState("");

    const cartItems = useMemo(
        () => (Array.isArray(cart.items) ? cart.items : []),
        [cart.items]
    );
    const totalItems = cartItems.reduce((count, item) => count + Number(item.quantity || 0), 0);
    const subtotal = cart.total_amount || cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const refreshCart = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getCart();
            setCart(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "We could not load your cart right now.");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const openCart = useCallback(() => {
        setModalOpen(true);
        refreshCart().catch(() => {});
    }, [refreshCart]);

    const closeCart = useCallback(() => {
        setModalOpen(false);
        setSuccessMessage("");
        setError("");
    }, []);

    const addItem = useCallback(async ({ productId, variantId, quantity = 1, size = "", color = "" }) => {
        const productKey = buildCartProductKey({ productId, variantId });

        try {
            setAddingProductKey(productKey);
            setError("");
            setSuccessMessage("");
            await addToCart({ productId, variantId, quantity, size, color });
            const data = await getCart();
            setCart(data);
            setModalOpen(true);
            setSuccessMessage("Item added to cart");
            window.setTimeout(() => setSuccessMessage(""), 1600);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "We could not add this item to cart.");
            setModalOpen(true);
            throw err;
        } finally {
            setAddingProductKey("");
        }
    }, []);

    const updateQuantity = useCallback(async (itemId, quantity) => {
        try {
            setUpdatingItemId(itemId);
            setError("");
            const data = await updateCartItemQuantity(itemId, quantity);
            setCart(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "We could not update this item.");
            throw err;
        } finally {
            setUpdatingItemId("");
        }
    }, []);

    const removeItem = useCallback(async (itemId) => {
        try {
            setUpdatingItemId(itemId);
            setError("");
            const data = await removeCartItem(itemId);
            setCart(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "We could not remove this item.");
            throw err;
        } finally {
            setUpdatingItemId("");
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            refreshCart().catch(() => {});
        }
    }, [refreshCart]);

    const value = useMemo(() => ({
        cart,
        cartItems,
        totalItems,
        subtotal,
        modalOpen,
        loading,
        addingProductKey,
        error,
        successMessage,
        updatingItemId,
        openCart,
        closeCart,
        refreshCart,
        addItem,
        removeItem,
        updateQuantity,
    }), [
        cart,
        cartItems,
        totalItems,
        subtotal,
        modalOpen,
        loading,
        addingProductKey,
        error,
        successMessage,
        updatingItemId,
        openCart,
        closeCart,
        refreshCart,
        addItem,
        removeItem,
        updateQuantity,
    ]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCartContext must be used within CartProvider");
    }

    return context;
};
