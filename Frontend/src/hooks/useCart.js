import { useCallback, useEffect, useState } from "react";
import { clearCart, getCart, removeCartItem, updateCartItemQuantity } from "../services/cartService";

const emptyCart = {
    items: [],
    total_amount: 0,
};

const useCart = () => {
    const [cart, setCart] = useState(emptyCart);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingItemId, setUpdatingItemId] = useState("");

    const refreshCart = useCallback(async () => {
        try {
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

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const updateQuantity = async (itemId, quantity) => {
        try {
            setUpdatingItemId(itemId);
            setError("");
            const data = await updateCartItemQuantity(itemId, quantity);
            setCart(data);
        } catch (err) {
            setError(err.response?.data?.message || "We could not update this item.");
        } finally {
            setUpdatingItemId("");
        }
    };

    const removeItem = async (itemId) => {
        try {
            setUpdatingItemId(itemId);
            setError("");
            const data = await removeCartItem(itemId);
            setCart(data);
        } catch (err) {
            setError(err.response?.data?.message || "We could not remove this item.");
        } finally {
            setUpdatingItemId("");
        }
    };

    const emptyCurrentCart = async () => {
        try {
            setUpdatingItemId("cart");
            setError("");
            const data = await clearCart();
            setCart(data);
        } catch (err) {
            setError(err.response?.data?.message || "We could not clear your cart.");
        } finally {
            setUpdatingItemId("");
        }
    };

    return {
        cart,
        loading,
        error,
        updatingItemId,
        updateQuantity,
        removeItem,
        emptyCurrentCart,
        refreshCart,
    };
};

export default useCart;
