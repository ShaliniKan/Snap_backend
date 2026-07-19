import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SectionState from "../components/common/SectionState";
import CheckoutModal from "../components/checkout/CheckoutModal";
import useCart from "../hooks/useCart";
import { useCartContext } from "../context/CartContext";
import { getCartItemAttributesLine } from "../utils/cartHelpers";

const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
};

const getProductName = (item) => {
    return item.product_id?.name || "Product";
};

const getProductImage = (item) => {
    return item.product_id?.images?.[0] || item.product_id?.image || item.product_id?.thumbnail || "/banner1.jpg";
};

const Cart = () => {
    const {
        cart,
        loading,
        error,
        updatingItemId,
        updateQuantity,
        removeItem,
        emptyCurrentCart,
        refreshCart,
    } = useCart();
    const { refreshCart: refreshGlobalCart } = useCartContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get("checkout") === "1") {
            setIsCheckoutOpen(true);
            searchParams.delete("checkout");
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const items = Array.isArray(cart.items) ? cart.items : [];
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const subtotal = cart.total_amount || items.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryCharge = subtotal > 0 ? 0 : 0;
    const payableTotal = subtotal + deliveryCharge;

    if (loading) {
        return <SectionState>Loading your cart...</SectionState>;
    }

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-500">Shopping Cart</p>
                    <h1 className="mt-2 text-2xl font-semibold text-slate-900">My Cart</h1>
                </div>
                <Link className="text-sm font-semibold text-red-500 hover:text-red-600" to="/">
                    Continue Shopping
                </Link>
            </div>

            {error && (
                <div className="mb-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            {items.length === 0 ? (
                <div className="rounded-sm border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">Your cart is empty</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Add products you love and review them here before checkout.
                    </p>
                    <Link
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-sm bg-red-500 px-8 text-sm font-semibold text-white transition hover:bg-red-600"
                        to="/"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <section className="rounded-sm border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">Cart Items</h2>
                                <p className="text-xs text-slate-500">{itemCount} item(s) in your cart</p>
                            </div>
                            <button
                                className="text-sm font-semibold text-red-500 hover:text-red-600 disabled:text-slate-300"
                                disabled={updatingItemId === "cart"}
                                onClick={emptyCurrentCart}
                                type="button"
                            >
                                Clear Cart
                            </button>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {items.map((item) => {
                                const isUpdating = updatingItemId === item._id;
                                const productName = getProductName(item);

                                return (
                                    <article className="grid gap-4 px-4 py-5 sm:grid-cols-[96px_minmax(0,1fr)_160px] sm:px-5" key={item._id}>
                                        <div className="h-24 w-24 overflow-hidden rounded-sm border border-slate-100 bg-slate-50">
                                            <img className="h-full w-full object-cover" src={getProductImage(item)} alt={productName} />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">{productName}</h3>
                                            <p className="mt-1 text-[12px] leading-[18px] text-[#757575]">
                                                {getCartItemAttributesLine(item)}
                                            </p>
                                            <p className="mt-3 text-base font-semibold text-slate-900">{formatCurrency(item.price)}</p>

                                            <button
                                                className="mt-3 text-sm font-semibold text-slate-500 hover:text-red-500 disabled:text-slate-300"
                                                disabled={isUpdating}
                                                onClick={() => removeItem(item._id)}
                                                type="button"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                                            <div className="flex h-9 items-center rounded-sm border border-slate-200 bg-white">
                                                <button
                                                    className="h-full px-3 text-lg font-semibold text-slate-600 disabled:text-slate-300"
                                                    disabled={isUpdating || item.quantity <= 1}
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    type="button"
                                                >
                                                    -
                                                </button>
                                                <span className="min-w-9 border-x border-slate-200 px-3 text-center text-sm font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    className="h-full px-3 text-lg font-semibold text-slate-600 disabled:text-slate-300"
                                                    disabled={isUpdating}
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    type="button"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    <aside className="h-fit rounded-sm border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-4">
                            <h2 className="text-base font-semibold text-slate-900">Price Details</h2>
                        </div>
                        <div className="space-y-3 px-5 py-4 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Price ({itemCount} item)</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Delivery Charges</span>
                                <span className="font-semibold text-emerald-600">Free</span>
                            </div>
                            <div className="border-t border-dashed border-slate-200 pt-3">
                                <div className="flex justify-between text-base font-semibold text-slate-900">
                                    <span>Amount Payable</span>
                                    <span>{formatCurrency(payableTotal)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-slate-100 p-5">
                            <button
                                className="h-11 w-full rounded-sm bg-red-500 text-sm font-semibold text-white transition hover:bg-red-600"
                                type="button"
                                onClick={() => setIsCheckoutOpen(true)}
                            >
                                Proceed to Pay
                            </button>
                            <p className="mt-3 text-center text-xs text-slate-500">Safe and secure payments</p>
                        </div>
                    </aside>
                </div>
            )}

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                subtotal={subtotal}
                itemCount={itemCount}
                onOrderSuccess={() => {
                    refreshCart();
                    refreshGlobalCart();
                }}
            />
        </div>
    );
};

export default Cart;
