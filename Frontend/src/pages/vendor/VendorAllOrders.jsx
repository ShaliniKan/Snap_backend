import { useEffect, useState } from "react";
import SectionState from "../../components/common/SectionState";
import { getAllPlatformOrders, updatePlatformOrderStatus } from "../../services/vendorService";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const STATUS_OPTIONS = ["placed", "processing", "shipped", "delivered", "cancelled"];

const VendorAllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState("");

    const loadOrders = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getAllPlatformOrders();
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || "Could not load orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusChange = async (orderId, order_status) => {
        setUpdatingId(orderId);

        try {
            await updatePlatformOrderStatus(orderId, order_status);
            await loadOrders();
        } catch (err) {
            window.alert(err.response?.data?.message || "Could not update order status.");
        } finally {
            setUpdatingId("");
        }
    };

    if (loading) return <SectionState>Loading orders...</SectionState>;
    if (error) return <SectionState variant="error">{error}</SectionState>;

    return (
        <div className="space-y-4">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Platform</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">All Orders</h2>
            </div>
            {orders.length === 0 ? (
                <SectionState>No orders yet.</SectionState>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap justify-between gap-3">
                            <div>
                                <p className="font-semibold text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                                <p className="text-sm text-slate-500">
                                    {order.customer_id?.firstName} {order.customer_id?.lastName}
                                </p>
                                <p className="text-xs text-slate-400">{order.customer_id?.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-red-600">{formatCurrency(order.total_amount)}</p>
                                <p className="text-xs uppercase text-slate-500">{order.payment_status}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <label className="text-sm text-slate-600">
                                Status
                                <select
                                    className="ml-2 rounded-sm border border-slate-200 px-2 py-1 text-sm capitalize"
                                    value={order.order_status}
                                    disabled={updatingId === order._id}
                                    onChange={(event) => handleStatusChange(order._id, event.target.value)}
                                >
                                    {STATUS_OPTIONS.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {updatingId === order._id && (
                                <span className="text-xs text-slate-500">Updating...</span>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default VendorAllOrders;
