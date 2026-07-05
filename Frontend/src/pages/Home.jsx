import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./auth/login";
import Register from "./auth/register";
import TopHeader from "../components/layout/TopHeader";
import Navbar from "../components/layout/Navbar";
import ProductCard from "../components/product/ProductCard";

const initialAuthState = {
    name: "",
    email: "",
    password: "",
};

const Home = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [authData, setAuthData] = useState(initialAuthState);
    const [authMessage, setAuthMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await axios.get("/api/product");
                setProducts(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setError("We could not load products right now. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const handleAuthChange = (event) => {
        const { name, value } = event.target;
        setAuthData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError("");
        setAuthMessage("");

        try {
            const response = await axios.post("/api/users/login", {
                email: authData.email,
                password: authData.password,
            });

            if (response.data?.success) {
                setAuthMessage("Login successful. Welcome back!");
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
                setAuthData(initialAuthState);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError("");
        setAuthMessage("");

        try {
            const response = await axios.post("/api/users/register", {
                name: authData.name,
                email: authData.email,
                password: authData.password,
            });

            if (response.status === 201) {
                setAuthMessage("Account created successfully. Please login.");
                setAuthData(initialAuthState);
                setShowRegister(false);
                setShowLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeAuth = () => {
        setShowLogin(false);
        setShowRegister(false);
        setError("");
        setAuthMessage("");
        setAuthData(initialAuthState);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <TopHeader />
            <Navbar
                onLoginClick={() => {
                    setShowLogin(true);
                    setShowRegister(false);
                }}
            />

            {showLogin && (
                <Login
                    onClose={closeAuth}
                    onSwitchToRegister={() => {
                        setShowLogin(false);
                        setShowRegister(true);
                    }}
                    onSubmit={handleLogin}
                    formData={authData}
                    onChange={handleAuthChange}
                    isSubmitting={isSubmitting}
                    error={error}
                    message={authMessage}
                />
            )}

            {showRegister && (
                <Register
                    onClose={closeAuth}
                    onSwitchToLogin={() => {
                        setShowRegister(false);
                        setShowLogin(true);
                    }}
                    onSubmit={handleRegister}
                    formData={authData}
                    onChange={handleAuthChange}
                    isSubmitting={isSubmitting}
                    error={error}
                    message={authMessage}
                />
            )}

            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
                <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-red-500 to-orange-400 shadow-lg">
                    <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-100">Flash deals</p>
                            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Shop premium products at unbeatable prices.</h1>
                            <p className="mt-4 text-base text-red-50 sm:text-lg">Discover the latest arrivals across fashion, gadgets, beauty, and home essentials.</p>
                        </div>
                        <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                            <img src="/banner2.jpg" alt="Bestseller products" className="h-48 w-full rounded-2xl object-cover sm:w-80" />
                        </div>
                    </div>
                </section>

                <section>
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">Featured products</p>
                            <h2 className="text-2xl font-semibold text-slate-900">Trending picks for you</h2>
                        </div>
                        <a href="/" className="text-sm font-semibold text-red-500">View all</a>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">Loading products...</div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">{error}</div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Home;