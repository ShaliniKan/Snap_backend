const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
};

const CartSummary = ({ subtotal = 0, deliveryCharge = 0, total = 0 }) => {
    return (
        <div className="grid gap-2 text-sm text-white sm:grid-cols-3 sm:text-right">
            <div>
                <p className="text-xs text-slate-300">Subtotal</p>
                <p className="font-semibold">{formatCurrency(subtotal)}</p>
            </div>
            <div>
                <p className="text-xs text-slate-300">Delivery Charges</p>
                <p className="font-semibold text-emerald-300">{deliveryCharge === 0 ? "Free" : formatCurrency(deliveryCharge)}</p>
            </div>
            <div>
                <p className="text-xs text-slate-300">Grand Total</p>
                <p className="text-lg font-bold">{formatCurrency(total)}</p>
            </div>
        </div>
    );
};

export default CartSummary;
