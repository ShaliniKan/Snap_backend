import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountPageLayout from "../components/layout/account/AccountPageLayout";
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
        setError("");

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

    return (
        <AccountPageLayout pageTitle="My Orders" breadcrumbCurrent="My Orders">
            {loading ? (
                <SectionState>Loading your orders...</SectionState>
            ) : error ? (
                <SectionState variant="error">{error}</SectionState>
            ) : orders.length === 0 ? (
                <div className="flex min-h-[420px] items-center justify-center">
                    <p className="text-[14px] font-normal uppercase tracking-[0.08em] text-[#999999]">
                        No Orders Available
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="border border-[#e0e0e0] bg-white p-5">
                            <div className="flex flex-wrap justify-between gap-3">
                                <div>
                                    <p className="text-[14px] font-normal text-[#333333]">
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </p>
                                    <p className="mt-1 text-[12px] text-[#666666]">
                                        {new Date(order.createdAt).toLocaleString("en-IN")}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[16px] font-normal text-[#e40046]">{formatCurrency(order.total_amount)}</p>
                                    <p className="text-[11px] uppercase text-[#666666]">{order.order_status}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Link
                                    className="border border-[#e0e0e0] px-3 py-1.5 text-[12px] text-[#333333] hover:border-[#e40046] hover:text-[#e40046]"
                                    to={ROUTES.customer.orderDetails.replace(":orderId", order._id)}
                                >
                                    View Details
                                </Link>
                                {order.order_status === "placed" && (
                                    <button
                                        className="border border-[#f5c2cf] px-3 py-1.5 text-[12px] text-[#e40046]"
                                        onClick={() => handleCancel(order._id)}
                                        type="button"
                                    >
                                        Cancel
                                    </button>
                                )}
                                {["shipped", "delivered"].includes(order.order_status) && (
                                    <button
                                        className="border border-[#e0e0e0] px-3 py-1.5 text-[12px] text-[#333333]"
                                        onClick={() => handleReturn(order._id)}
                                        type="button"
                                    >
                                        Request Return
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AccountPageLayout>
    );
};

export default Orders;
