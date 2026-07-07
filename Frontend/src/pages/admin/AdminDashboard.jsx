import { useEffect, useState } from "react";
import SectionState from "../../components/common/SectionState";
import { getAdminDashboard } from "../../services/adminService";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getAdminDashboard()
            .then(setStats)
            .catch((err) => {
                setError(err.response?.data?.message || "Could not load admin dashboard. Make sure the backend server is running with the latest code.");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <SectionState>Loading admin dashboard...</SectionState>;
    if (error) return <SectionState variant="error">{error}</SectionState>;

    const cards = [
        { label: "Revenue", value: formatCurrency(stats?.revenue || 0) },
        { label: "Orders", value: stats?.orderCount || 0 },
        { label: "Customers", value: stats?.customerCount || 0 },
        { label: "Vendors", value: stats?.vendorCount || 0 },
        { label: "Active Coupons", value: stats?.couponCount || 0 },
        { label: "Pending Returns", value: stats?.pendingReturns || 0 },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900">Dashboard Overview</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                    <div key={card.label} className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">{card.label}</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
