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

export const createVendorProduct = async (payload) => {
    const response = await api.post("/api/product", payload);
    return getData(response);
};

export const updateVendorProduct = async (productId, payload) => {
    const response = await api.put(`/api/product/${productId}`, payload);
    return getData(response);
};

export const deleteVendorProduct = async (productId) => {
    const response = await api.delete(`/api/product/${productId}`);
    return getData(response);
};

export const createProductVariant = async (productId, payload) => {
    const response = await api.post(`/api/product/${productId}/`, payload);
    return getData(response);
};

export const updateProductVariant = async (productId, variantId, payload) => {
    const response = await api.put(`/api/product/${productId}/${variantId}`, payload);
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

export const getPendingVendors = async () => {
    const response = await api.get("/api/vendor/admin/pending");
    return getData(response) || [];
};

export const approveVendor = async (vendorUserId) => {
    const response = await api.put(`/api/vendor/admin/${vendorUserId}/approve`);
    return getData(response);
};

export const rejectVendor = async (vendorUserId) => {
    const response = await api.put(`/api/vendor/admin/${vendorUserId}/reject`);
    return getData(response);
};
