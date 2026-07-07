import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionState from "../components/common/SectionState";
import { cancelOrder, getMyOrders } from "../services/orderService";
import { createReturnRequest } from "../services/returnService";
import { ROUTES } from "../routes/routePaths";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await getMyOrders();
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

    const handleCancel = async (orderId) => {
        await cancelOrder(orderId);
        loadOrders();
    };

    const handleReturn = async (orderId) => {
        const reason = window.prompt("Why do you want to return this order?");
        if (!reason) return;
        await createReturnRequest(orderId, reason);
        window.alert("Return request submitted.");
    };

    if (loading) return <SectionState>Loading your orders...</SectionState>;
    if (error) return <SectionState variant="error">{error}</SectionState>;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">My Account</p>
                <h1 className="mt-1 text-2xl font-semibold text-slate-900">My Orders</h1>
            </div>

            {orders.length === 0 ? (
                <SectionState>No orders yet. <Link className="text-red-500" to={ROUTES.public.home}>Start shopping</Link></SectionState>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap justify-between gap-3">
                            <div>
                                <p className="font-semibold text-slate-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                                <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-red-600">{formatCurrency(order.total_amount)}</p>
                                <p className="text-xs uppercase text-slate-500">{order.order_status}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Link
                                className="rounded-sm border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
                                to={ROUTES.customer.orderDetails.replace(":orderId", order._id)}
                            >
                                View Details
                            </Link>
                            {order.order_status === "placed" && (
                                <button className="rounded-sm border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600" onClick={() => handleCancel(order._id)} type="button">Cancel</button>
                            )}
                            {["shipped", "delivered"].includes(order.order_status) && (
                                <button className="rounded-sm border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700" onClick={() => handleReturn(order._id)} type="button">Request Return</button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;
