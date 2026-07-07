import axios from "axios";

const api = axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach auth token from localStorage automatically
api.interceptors.request.use(
    (config) => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }

            if (config.data instanceof FormData) {
                delete config.headers["Content-Type"];
            }
        } catch (e) {
            // ignore
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Global response handler for auth failures
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            try {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } catch (e) {}
            // optional: force reload to show logged out state
            // window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default api;
