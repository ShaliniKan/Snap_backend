import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const parseTokenUser = (token) => {
    try {
        const payload = token.split(".")[1];
        return payload ? JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) : null;
    } catch (error) {
        return null;
    }
};

const readStoredUser = () => {
    try {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => readStoredUser());
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [authModal, setAuthModal] = useState(null);

    const openLogin = useCallback(() => setAuthModal("login"), []);
    const openRegister = useCallback(() => setAuthModal("register"), []);
    const openRegisterVendor = useCallback(() => setAuthModal("register-vendor"), []);
    const closeAuthModal = useCallback(() => setAuthModal(null), []);

    const persistSession = useCallback((nextToken, nextUser) => {
        setToken(nextToken);
        setUser(nextUser);
        localStorage.setItem("token", nextToken);
        localStorage.setItem("user", JSON.stringify(nextUser));
    }, []);

    const clearSession = useCallback(() => {
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }, []);

    const login = useCallback(async ({ email, password }) => {
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/api/users/login", { email, password });
            const nextToken = response.data?.token;

            if (!response.data?.success || !nextToken) {
                throw new Error(response.data?.message || "Login failed");
            }

            const sessionUser = {
                ...(response.data.user || {}),
                role: response.data.user?.role || parseTokenUser(nextToken)?.role,
                approvalStatus: response.data.user?.approvalStatus || parseTokenUser(nextToken)?.approvalStatus,
            };

            persistSession(nextToken, sessionUser);
            return sessionUser;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Login failed";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [persistSession]);

    const register = useCallback(async ({ name, email, password, role = "customer" }) => {
        setLoading(true);
        setError("");

        try {
            const response = await api.post(
                role === "vendor" ? "/api/users/register/vendor" : "/api/users/register",
                { name, email, password, role }
            );

            if (response.status !== 201) {
                throw new Error(response.data?.message || "Registration failed");
            }

            return response.data?.user;
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Registration failed";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const registerVendor = useCallback(async (payload) => register({ ...payload, role: "vendor" }), [register]);

    const logout = useCallback(() => {
        clearSession();
        setError("");
    }, [clearSession]);

    useEffect(() => {
        if (!token) {
            return;
        }

        const tokenUser = parseTokenUser(token);
        if (!tokenUser) {
            clearSession();
        }
    }, [clearSession, token]);

    const value = useMemo(() => ({
        user,
        token,
        isAuthenticated: Boolean(token),
        loading,
        error,
        authModal,
        login,
        register,
        registerVendor,
        logout,
        setError,
        openLogin,
        openRegister,
        openRegisterVendor,
        closeAuthModal,
    }), [
        user,
        token,
        loading,
        error,
        authModal,
        login,
        register,
        registerVendor,
        logout,
        openLogin,
        openRegister,
        openRegisterVendor,
        closeAuthModal,
    ]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};
