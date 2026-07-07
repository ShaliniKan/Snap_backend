import api from "./api";

export const getProductReviews = async (productId) => {
    const response = await api.get(`/api/reviews/product/${productId}`);
    return response.data?.data || [];
};

export const submitProductReview = async (productId, payload) => {
    const response = await api.post(`/api/reviews/product/${productId}`, payload);
    return response.data?.data;
};
