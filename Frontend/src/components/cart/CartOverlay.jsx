import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";
import Backdrop from "./Backdrop";
import CartFooter from "./CartFooter";
import CartItem from "./CartItem";

const CartOverlay = () => {
    const {
        cartItems,
        totalItems,
        subtotal,
        modalOpen,
        loading,
        error,
        successMessage,
        updatingItemId,
        closeCart,
        removeItem,
        updateQuantity,
    } = useCartContext();
    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);
    const deliveryCharge = subtotal > 0 ? 0 : 0;
    const grandTotal = subtotal + deliveryCharge;

    useEffect(() => {
        if (!modalOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeCart();
                return;
            }

            if (event.key !== "Tab" || !modalRef.current) {
                return;
            }

            const focusableElements = modalRef.current.querySelectorAll(
                'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (!firstElement || !lastElement) {
                return;
            }

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [closeCart, modalOpen]);

    if (!modalOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-3 py-5 sm:px-5">
            <Backdrop onClick={closeCart} />

            <section
                aria-labelledby="cart-overlay-title"
                aria-modal="true"
                className="relative z-[91] flex max-h-[92vh] w-full max-w-[1100px] scale-100 flex-col overflow-hidden rounded-md bg-white shadow-2xl transition duration-200"
                ref={modalRef}
                role="dialog"
            >
                <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900" id="cart-overlay-title">
                            Shopping Cart ({totalItems} Items)
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">Review items without leaving this page.</p>
                    </div>
                    <button
                        aria-label="Close cart"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-100"
                        onClick={closeCart}
                        ref={closeButtonRef}
                        type="button"
                    >
                        ×
                    </button>
                </header>

                {successMessage && (
                    <div className="mx-5 mt-4 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 sm:mx-6">
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="mx-5 mt-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 sm:mx-6">
                        {error}
                    </div>
                )}

                <div className="min-h-[280px] flex-1 overflow-y-auto">
                    <div className="hidden grid-cols-[minmax(260px,1fr)_120px_120px_120px_120px] border-b border-slate-200 bg-slate-100 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 lg:grid">
                        <span>Item Details</span>
                        <span>Price</span>
                        <span>Quantity</span>
                        <span>Availability</span>
                        <span>Subtotal</span>
                    </div>

                    {loading && cartItems.length === 0 ? (
                        <div className="flex h-64 items-center justify-center text-sm font-semibold text-slate-500">
                            Loading cart...
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center px-6 text-center">
                            <h3 className="text-lg font-semibold text-slate-900">Your cart is empty</h3>
                            <p className="mt-2 text-sm text-slate-500">Add a product and it will appear here instantly.</p>
                            <Link
                                className="mt-5 inline-flex h-10 items-center justify-center rounded-sm bg-[#e40046] px-6 text-sm font-semibold text-white transition hover:bg-[#c9003f]"
                                onClick={closeCart}
                                to="/"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <CartItem
                                disabled={updatingItemId === item._id}
                                item={item}
                                key={item._id}
                                onQuantityChange={updateQuantity}
                                onRemove={removeItem}
                            />
                        ))
                    )}
                </div>

                <CartFooter
                    deliveryCharge={deliveryCharge}
                    onClose={closeCart}
                    subtotal={subtotal}
                    total={grandTotal}
                />
            </section>
        </div>
    );
};

export default CartOverlay;
