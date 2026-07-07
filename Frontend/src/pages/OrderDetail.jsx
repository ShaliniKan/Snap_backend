import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SectionState from "../components/common/SectionState";
import { cancelOrder, getOrderById } from "../services/orderService";
import { createReturnRequest } from "../services/returnService";
import { ROUTES } from "../routes/routePaths";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadOrder = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getOrderById(orderId);
            setOrder(data);
        } catch (err) {
            setError(err.response?.data?.message || "Could not load order details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    const handleCancel = async () => {
        await cancelOrder(orderId);
        loadOrder();
    };

    const handleReturn = async () => {
        const reason = window.prompt("Why do you want to return this order?");
        if (!reason) return;
        await createReturnRequest(orderId, reason);
        window.alert("Return request submitted.");
    };

    if (loading) return <SectionState>Loading order details...</SectionState>;
    if (error) return <SectionState variant="error">{error}</SectionState>;
    if (!order) return <SectionState>Order not found.</SectionState>;

    return (
        <div className="space-y-6">
            <div>
                <Link className="text-sm font-semibold text-red-500" to={ROUTES.customer.orders}>
                    ← Back to orders
                </Link>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Order Details</p>
                <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                    Order #{order._id.slice(-8).toUpperCase()}
                </h1>
                <p className="mt-1 text-sm text-slate-500">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Status</h2>
                    <p className="mt-2 text-lg font-semibold capitalize text-slate-900">{order.order_status}</p>
                    <p className="mt-1 text-sm capitalize text-slate-600">Payment: {order.payment_status}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {order.order_status === "placed" && (
                            <button
                                className="rounded-sm border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                                onClick={handleCancel}
                                type="button"
                            >
                                Cancel Order
                            </button>
                        )}
                        {["shipped", "delivered"].includes(order.order_status) && (
                            <button
                                className="rounded-sm border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
                                onClick={handleReturn}
                                type="button"
                            >
                                Request Return
                            </button>
                        )}
                    </div>
                </div>

                <div className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Summary</h2>
                    <dl className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-600">Subtotal</dt>
                            <dd>{formatCurrency(order.subtotal || order.total_amount)}</dd>
                        </div>
                        {order.delivery_charge != null && (
                            <div className="flex justify-between">
                                <dt className="text-slate-600">Delivery</dt>
                                <dd>{formatCurrency(order.delivery_charge)}</dd>
                            </div>
                        )}
                        {order.discount_amount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <dt>Discount</dt>
                                <dd>-{formatCurrency(order.discount_amount)}</dd>
                            </div>
                        )}
                        <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold text-slate-900">
                            <dt>Total</dt>
                            <dd className="text-red-600">{formatCurrency(order.total_amount)}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            {order.shipping_address && (
                <div className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Shipping Address</h2>
                    <p className="mt-2 text-sm text-slate-700">
                        {order.shipping_address.fullName}<br />
                        {order.shipping_address.addressLine1}
                        {order.shipping_address.addressLine2 ? `, ${order.shipping_address.addressLine2}` : ""}<br />
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}<br />
                        {order.shipping_address.phone}
                    </p>
                </div>
            )}

            <div className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Items</h2>
                <ul className="mt-4 divide-y divide-slate-100">
                    {(order.items || []).map((item, index) => (
                        <li key={item._id || index} className="flex gap-4 py-4 first:pt-0">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-slate-100">
                                {item.product_id?.images?.[0] && (
                                    <img
                                        src={item.product_id.images[0]}
                                        alt={item.product_id?.name || "Product"}
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900">{item.product_id?.name || "Product"}</p>
                                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderDetail;
