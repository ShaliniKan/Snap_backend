import { useEffect, useState } from "react";
import SectionState from "../../components/common/SectionState";
import { getVendorOrders, updateVendorOrderStatus } from "../../services/vendorService";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const statusOptions = ["processing", "shipped", "delivered"];

const VendorOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState("");

    const loadOrders = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getVendorOrders();
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
        try {
            setUpdatingId(orderId);
            await updateVendorOrderStatus(orderId, order_status);
            await loadOrders();
        } catch (err) {
            setError(err.response?.data?.message || "Could not update order status.");
        } finally {
            setUpdatingId("");
        }
    };

    return (
            <div className="space-y-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Fulfillment</p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900">Orders</h2>
                </div>

                {loading ? (
                    <SectionState>Loading orders...</SectionState>
                ) : error ? (
                    <SectionState variant="error">{error}</SectionState>
                ) : orders.length === 0 ? (
                    <SectionState>No orders yet for your products.</SectionState>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {order.customer_id?.firstName} {order.customer_id?.lastName} · {order.customer_id?.email}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-red-600">{formatCurrency(order.vendor_total)}</p>
                                        <p className="text-xs font-semibold uppercase text-slate-500">{order.order_status}</p>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                                    {order.items.map((item) => (
                                        <div key={item._id} className="flex justify-between text-sm">
                                            <span>{item.product_id?.name} × {item.quantity}</span>
                                            <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-700">Update status:</span>
                                    {statusOptions.map((status) => (
                                        <button
                                            key={status}
                                            className={`rounded-sm px-3 py-1.5 text-xs font-semibold capitalize ${
                                                order.order_status === status
                                                    ? "bg-red-500 text-white"
                                                    : "border border-slate-200 text-slate-700 hover:border-red-200 hover:text-red-600"
                                            }`}
                                            disabled={updatingId === order._id}
                                            onClick={() => handleStatusChange(order._id, status)}
                                            type="button"
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
    );
};

export default VendorOrders;
