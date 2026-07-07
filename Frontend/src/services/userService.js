import api from "./api";

export const getCustomerProfile = async () => {
    const response = await api.get("/api/customer/profile");
    return response.data?.data || response.data;
};

export const updateCustomerProfile = async (payload) => {
    const response = await api.put("/api/customer/profile", payload);
    return response.data?.data || response.data;
};

export const addCustomerAddress = async (address) => {
    const response = await api.post("/api/customer/addresses", address);
    return response.data?.data || response.data;
};

export const updateCustomerAddress = async (addressId, address) => {
    const response = await api.put(`/api/customer/addresses/${addressId}`, address);
    return response.data?.data || response.data;
};

export const deleteCustomerAddress = async (addressId) => {
    const response = await api.delete(`/api/customer/addresses/${addressId}`);
    return response.data?.data || response.data;
};

export const setDefaultCustomerAddress = async (addressId) => {
    const response = await api.put(`/api/customer/addresses/${addressId}/default`);
    return response.data?.data || response.data;
};
