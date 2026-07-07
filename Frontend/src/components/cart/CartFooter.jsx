import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import CartSummary from "./CartSummary";

const CartFooter = ({ subtotal, deliveryCharge, total, onClose }) => {
    return (
        <div className="sticky bottom-0 border-t border-slate-800 bg-slate-900 px-5 py-4 text-white sm:px-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr_auto] lg:items-center">
                <div className="grid grid-cols-3 gap-3 text-xs font-semibold text-slate-200">
                    <span>Safe Payments</span>
                    <span>Payment Protection</span>
                    <span>Easy Returns</span>
                </div>

                <CartSummary deliveryCharge={deliveryCharge} subtotal={subtotal} total={total} />

                <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                    <Link
                        className="inline-flex h-11 items-center justify-center rounded-sm border border-slate-600 px-5 text-sm font-semibold text-white transition hover:border-white"
                        onClick={onClose}
                        to={ROUTES.customer.cart}
                    >
                        View Full Cart
                    </Link>
                    <Link
                        className="inline-flex h-11 items-center justify-center rounded-sm bg-[#e40046] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c9003f]"
                        onClick={onClose}
                        to={`${ROUTES.customer.cart}?checkout=1`}
                    >
                        Proceed To Pay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartFooter;
