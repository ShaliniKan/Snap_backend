import api from "./api";

export const getMyReturns = async () => {
    const response = await api.get("/api/returns/my");
    return response.data?.data || [];
};

export const createReturnRequest = async (orderId, reason) => {
    const response = await api.post(`/api/returns/order/${orderId}`, { reason });
    return response.data?.data;
};

export const getAdminReturns = async () => {
    const response = await api.get("/api/returns");
    return response.data?.data || [];
};

export const updateReturnStatus = async (returnId, payload) => {
    const response = await api.put(`/api/returns/${returnId}`, payload);
    return response.data?.data;
};
