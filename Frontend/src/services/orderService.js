import api from "./api";

export const createOrder = async (payload) => {
    const response = await api.post("/api/order", payload);
    return response.data?.data || response.data;
};

export const getMyOrders = async () => {
    const response = await api.get("/api/order");
    return response.data?.data || [];
};

export const getOrderById = async (orderId) => {
    const response = await api.get(`/api/order/${orderId}`);
    return response.data?.data || response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await api.put(`/api/order/${orderId}/cancel`);
    return response.data?.data || response.data;
};
