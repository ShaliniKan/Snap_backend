import api from "./api";

export const checkPincode = async (pincode) => {
    const response = await api.get(`/api/delivery/pincode/${pincode}`);
    return response.data?.data;
};
