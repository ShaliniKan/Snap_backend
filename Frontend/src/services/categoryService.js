import api from "./api";

export const getCategories = async () => {
    const response = await api.get("/api/categories");
    return Array.isArray(response.data) ? response.data : [];
};

export const getCategoryDetails = async (categoryId) => {
    const response = await api.get(`/api/categories/${categoryId}`);
    return response.data || null;
};

export const getSubcategories = async (categoryId) => {
    const response = await api.get(`/api/categories/${categoryId}/subcategories`);
    return Array.isArray(response.data) ? response.data : [];
};
