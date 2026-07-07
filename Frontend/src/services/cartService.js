import api from "./api";

const getCartData = (response) => {
    return response.data?.data || { items: [], total_amount: 0 };
};

export const getCart = async () => {
    const response = await api.get("/api/cart");
    return getCartData(response);
};

export const addToCart = async ({ productId, variantId, quantity = 1 }) => {
    const response = await api.post("/api/cart/add", {
        product_id: productId,
        variant_id: variantId,
        quantity,
    });

    return getCartData(response);
};

export const updateCartItemQuantity = async (itemId, quantity) => {
    const response = await api.put(`/api/cart/item/${itemId}`, { quantity });
    return getCartData(response);
};

export const removeCartItem = async (itemId) => {
    const response = await api.delete(`/api/cart/item/${itemId}`);
    return getCartData(response);
};

export const clearCart = async () => {
    const response = await api.delete("/api/cart");
    return getCartData(response);
};
