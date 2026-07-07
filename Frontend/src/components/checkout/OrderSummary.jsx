const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
};

const OrderSummary = ({ cart, subtotal, deliveryCharge, discountAmount, payableTotal, itemCount, couponCode, onCouponApply, couponError, couponMessage }) => {
    const items = Array.isArray(cart?.items) ? cart.items : [];
    const firstItem = items[0];

    return (
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="border-b border-slate-100 pb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">Order Summary</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{itemCount} item(s)</h3>
            </div>

            <div className="mt-4 space-y-4">
                {firstItem ? (
                    <div className="flex gap-3 rounded-lg border border-slate-100 p-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-slate-100">
                            <img className="h-full w-full object-cover" src={firstItem.product_id?.images?.[0] || firstItem.product_id?.image || "/banner1.jpg"} alt={firstItem.product_id?.name || "Product"} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900">{firstItem.product_id?.name || "Product"}</p>
                            <p className="mt-1 text-xs text-slate-500">{firstItem.variant_id?.color || "Standard"}</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">Qty: {firstItem.quantity}</p>
                        </div>
                    </div>
                ) : null}

                <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Coupon code</label>
                    <div className="flex gap-2">
                        <input
                            className="h-10 flex-1 rounded-sm border border-slate-200 px-3 text-sm uppercase"
                            placeholder="e.g. WELCOME10"
                            value={couponCode}
                            onChange={(event) => onCouponApply(event.target.value, false)}
                        />
                        <button
                            className="rounded-sm bg-slate-900 px-3 text-xs font-semibold text-white"
                            onClick={() => onCouponApply(couponCode, true)}
                            type="button"
                        >
                            Apply
                        </button>
                    </div>
                    {couponError && <p className="text-xs text-red-600">{couponError}</p>}
                    {couponMessage && <p className="text-xs text-emerald-600">{couponMessage}</p>}
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between"><span>Delivery</span><span>{deliveryCharge > 0 ? formatCurrency(deliveryCharge) : "Free"}</span></div>
                    <div className="flex justify-between"><span>Discount</span><span className="text-emerald-600">- {formatCurrency(discountAmount)}</span></div>
                    <div className="flex justify-between border-t border-dashed border-slate-200 pt-3 text-base font-semibold text-slate-900"><span>Final Total</span><span>{formatCurrency(payableTotal)}</span></div>
                </div>
            </div>
        </aside>
    );
};

export default OrderSummary;
