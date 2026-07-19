import { useEffect, useState } from "react";
import SectionState from "../../components/common/SectionState";
import { getPlatformDashboardStats } from "../../services/vendorService";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const VendorPlatformOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getPlatformDashboardStats()
            .then(setStats)
            .catch((err) => {
                setError(err.response?.data?.message || "Could not load platform overview.");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <SectionState>Loading platform overview...</SectionState>;
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
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Platform</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">Overview</h2>
            </div>
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

export default VendorPlatformOverview;
