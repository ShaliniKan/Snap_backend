import api from "./api";

export const createReturnRequest = async (orderId, reason) => {
    const response = await api.post(`/api/returns/order/${orderId}`, { reason });
    return response.data?.data;
};

export const getVendorReturns = async () => {
    const response = await api.get("/api/returns");
    return response.data?.data || [];
};

export const updateReturnStatus = async (returnId, payload) => {
    const response = await api.put(`/api/returns/${returnId}`, payload);
    return response.data?.data;
};
