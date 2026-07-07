import api from "./api";

export const createPaymentOrder = async (amount) => {
    const response = await api.post("/api/payment/create-order", { amount });
    return response.data?.data;
};

export const verifyPayment = async (payload) => {
    const response = await api.post("/api/payment/verify", payload);
    return response.data;
};
