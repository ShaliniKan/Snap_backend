import api from "./api";

export const validateCoupon = async (code, subtotal) => {
    const response = await api.post("/api/coupons/validate", { code, subtotal });
    return response.data?.data;
};

export const getCoupons = async () => {
    const response = await api.get("/api/coupons");
    return response.data?.data || [];
};

export const createCoupon = async (payload) => {
    const response = await api.post("/api/coupons", payload);
    return response.data?.data;
};
