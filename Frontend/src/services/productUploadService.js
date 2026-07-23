import api from "./api";

const getApiErrorMessage = (error, fallback) => {
    const message = error?.response?.data?.message;

    if (message) {
        return message;
    }

    if (typeof error?.response?.data === "string" && error.response.data.includes("Only image files are allowed")) {
        return "Only image files are allowed";
    }

    return fallback;
};

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

    try {
        const response = await api.post("/api/product", formData);
        return response.data?.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Could not save product."));
    }
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

    try {
        const response = await api.put(`/api/product/${productId}`, formData);
        return response.data?.data;
    } catch (error) {
        throw new Error(getApiErrorMessage(error, "Could not save product."));
    }
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
