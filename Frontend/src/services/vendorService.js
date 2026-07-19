import api from "./api";

const getData = (response) => response.data?.data;

export const getVendorProfile = async () => {
    const response = await api.get("/api/vendor/profile");
    return getData(response);
};

export const createVendorProfile = async (payload) => {
    const response = await api.post("/api/vendor/profile", payload);
    return getData(response);
};

export const updateVendorProfile = async (payload) => {
    const response = await api.put("/api/vendor/profile", payload);
    return getData(response);
};

export const getVendorDashboardStats = async () => {
    const response = await api.get("/api/vendor/dashboard");
    return getData(response);
};

export const getVendorProducts = async () => {
    const response = await api.get("/api/product/vendor/me");
    return getData(response) || [];
};

export const deleteVendorProduct = async (productId) => {
    const response = await api.delete(`/api/product/${productId}`);
    return getData(response);
};

export const deleteProductVariant = async (productId, variantId) => {
    const response = await api.delete(`/api/product/${productId}/${variantId}`);
    return getData(response);
};

export const getVendorOrders = async () => {
    const response = await api.get("/api/order/vendor");
    return getData(response) || [];
};

export const updateVendorOrderStatus = async (orderId, order_status) => {
    const response = await api.put(`/api/order/vendor/${orderId}/status`, { order_status });
    return getData(response);
};

export const getPlatformDashboardStats = async () => {
    const response = await api.get("/api/vendor/platform/dashboard");
    return getData(response);
};

export const getAllPlatformOrders = async () => {
    const response = await api.get("/api/vendor/platform/orders");
    return getData(response) || [];
};

export const updatePlatformOrderStatus = async (orderId, order_status) => {
    const response = await api.put(`/api/vendor/platform/orders/${orderId}/status`, { order_status });
    return getData(response);
};
