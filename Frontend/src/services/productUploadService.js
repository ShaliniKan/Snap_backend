import api from "./api";

export const createVendorProductWithImage = async (payload, imageFile, galleryFiles = []) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value);
        }
    });

    if (imageFile) {
        formData.append("image", imageFile);
    }

    galleryFiles.forEach((file) => {
        formData.append("gallery", file);
    });

    const response = await api.post("/api/product", formData);
    return response.data?.data;
};

export const updateVendorProductWithImage = async (productId, payload, imageFile, galleryFiles = []) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value);
        }
    });

    if (imageFile) {
        formData.append("image", imageFile);
    }

    galleryFiles.forEach((file) => {
        formData.append("gallery", file);
    });

    const response = await api.put(`/api/product/${productId}`, formData);
    return response.data?.data;
};

export const createVariantWithImage = async (productId, payload, imageFile) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value);
        }
    });

    if (imageFile) {
        formData.append("image", imageFile);
    }

    const response = await api.post(`/api/product/${productId}`, formData);
    return response.data?.data;
};
