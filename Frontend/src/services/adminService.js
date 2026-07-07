import api from "./api";

export const getAdminDashboard = async () => {
    const response = await api.get("/api/admin/dashboard");
    return response.data?.data;
};

export const getAdminOrders = async () => {
    const response = await api.get("/api/admin/orders");
    return response.data?.data || [];
};

export const updateAdminOrderStatus = async (orderId, order_status) => {
    const response = await api.put(`/api/admin/orders/${orderId}/status`, { order_status });
    return response.data?.data || response.data;
};
