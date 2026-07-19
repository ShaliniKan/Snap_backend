import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "../../pages/auth/login";
import Register from "../../pages/auth/register";
import { useAuth } from "../../context/AuthContext";
import { ROUTES, USER_ROLES } from "../../routes/routePaths";

const initialAuthState = {
    name: "",
    email: "",
    password: "",
};

const AuthModal = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        authModal,
        authIntent,
        closeAuthModal,
        openLogin,
        openRegister,
        openRegisterVendor,
        login,
        register,
        registerVendor,
        loading: authLoading,
        error: authContextError,
        setError: setAuthContextError,
    } = useAuth();

    const [authData, setAuthData] = useState(initialAuthState);
    const [authError, setAuthError] = useState("");
    const [authMessage, setAuthMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isOpen = authModal !== null;
    const registerAsVendor = authModal === "register-vendor";

    useEffect(() => {
        if (searchParams.get("login") === "1") {
            openLogin(searchParams.get("vendor") === "1" ? "vendor" : "customer");
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams, openLogin]);

    useEffect(() => {
        if (searchParams.get("sell") === "1") {
            openRegisterVendor();
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams, openRegisterVendor]);

    useEffect(() => {
        if (!isOpen) {
            setAuthData(initialAuthState);
            setAuthError("");
        }
    }, [isOpen]);

    const redirectAfterAuth = (sessionUser) => {
        if (sessionUser?.role === USER_ROLES.vendor) {
            navigate(ROUTES.vendor.dashboard);
        }
    };

    const handleAuthChange = (event) => {
        const { name, value } = event.target;
        setAuthData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setAuthError("");
        setAuthMessage("");
        setAuthContextError("");

        try {
            const sessionUser = await login({
                email: authData.email,
                password: authData.password,
            });

            closeAuthModal();
            setAuthData(initialAuthState);
            redirectAfterAuth(sessionUser);
        } catch (err) {
            setAuthError(err.response?.data?.message || authContextError || "Login failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setAuthError("");
        setAuthMessage("");
        setAuthContextError("");

        try {
            if (registerAsVendor) {
                await registerVendor({
                    name: authData.name,
                    email: authData.email,
                    password: authData.password,
                });
                setAuthMessage("Seller account created. Please login and complete your business profile.");
            } else {
                await register({
                    name: authData.name,
                    email: authData.email,
                    password: authData.password,
                });
                setAuthMessage("Account created successfully. Please login.");
            }

            setAuthData(initialAuthState);
            openLogin();
        } catch (err) {
            setAuthError(err.response?.data?.message || authContextError || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeAuth = () => {
        closeAuthModal();
        setAuthError("");
        setAuthMessage("");
        setAuthData(initialAuthState);
    };

    if (!isOpen) {
        return null;
    }

    if (authModal === "register" || registerAsVendor) {
        return (
            <Register
                onClose={closeAuth}
                onSwitchToLogin={() => {
                    setAuthError("");
                    openLogin();
                }}
                onSubmit={handleRegister}
                formData={authData}
                onChange={handleAuthChange}
                isSubmitting={isSubmitting || authLoading}
                error={authError}
                message={authMessage}
                title={registerAsVendor ? "Become a Seller" : "Sign up"}
                subtitle={registerAsVendor ? "Register as an ApnaMart seller" : "Create account"}
                submitLabel={registerAsVendor ? "Create seller account" : "Create account"}
            />
        );
    }

    return (
        <Login
            onClose={closeAuth}
            onSwitchToRegister={() => {
                setAuthError("");
                setAuthMessage("");
                if (authIntent === "vendor") {
                    openRegisterVendor();
                } else {
                    openRegister("customer");
                }
            }}
            onSubmit={handleLogin}
            formData={authData}
            onChange={handleAuthChange}
            isSubmitting={isSubmitting || authLoading}
            error={authError}
            message={authMessage}
            subtitle={authIntent === "vendor" ? "Seller account" : "Welcome back"}
            title={authIntent === "vendor" ? "Seller Login" : "Login"}
        />
    );
};

export default AuthModal;
