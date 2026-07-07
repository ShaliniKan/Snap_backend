import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionState from "../../components/common/SectionState";
import { getVendorDashboardStats } from "../../services/vendorService";
import { ROUTES } from "../../routes/routePaths";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const statCards = [
    { key: "productCount", label: "Total Products", accent: "text-slate-900" },
    { key: "activeProducts", label: "Active Products", accent: "text-emerald-600" },
    { key: "orderCount", label: "Total Orders", accent: "text-slate-900" },
    { key: "pendingOrders", label: "Pending Orders", accent: "text-amber-600" },
    { key: "revenue", label: "Revenue", accent: "text-red-600", format: formatCurrency },
];

const VendorDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getVendorDashboardStats();
                setStats(data);
            } catch (err) {
                setError(err.response?.data?.message || "Could not load dashboard stats.");
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    if (loading) {
        return <SectionState>Loading seller dashboard...</SectionState>;
    }

    if (error) {
        return <SectionState variant="error">{error}</SectionState>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Seller Dashboard</p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900">Welcome back</h2>
                </div>
                <Link
                    className="rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                    to={ROUTES.vendor.productNew}
                >
                    Add Product
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {statCards.map((card) => {
                    const rawValue = stats?.[card.key] ?? 0;
                    const value = card.format ? card.format(rawValue) : rawValue;

                    return (
                        <div key={card.key} className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">{card.label}</p>
                            <p className={`mt-2 text-3xl font-semibold ${card.accent}`}>{value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">Quick actions</h3>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Link className="rounded-sm border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-red-200 hover:text-red-600" to={ROUTES.vendor.products}>
                            Manage Products
                        </Link>
                        <Link className="rounded-sm border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-red-200 hover:text-red-600" to={ROUTES.vendor.orders}>
                            View Orders
                        </Link>
                        <Link className="rounded-sm border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-red-200 hover:text-red-600" to={ROUTES.vendor.profile}>
                            Seller Profile
                        </Link>
                    </div>
                </div>

                <div className="rounded-sm border border-slate-200 bg-[#ffe7ea] p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">Snapdeal-style seller tips</h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        <li>Keep product images clear and prices competitive.</li>
                        <li>Update stock regularly to avoid order cancellations.</li>
                        <li>Ship orders quickly to improve customer ratings.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
