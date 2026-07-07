import QuantitySelector from "./QuantitySelector";

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

const getBrand = (item) => {
    return item.product_id?.brand || "ApnaMart";
};

const getVariantLabel = (item) => {
    const details = [item.variant_id?.color, item.variant_id?.size].filter(Boolean);
    return details.length > 0 ? details.join(" / ") : "Standard";
};

const CartItem = ({ item, disabled = false, onRemove, onQuantityChange }) => {
    const productName = getProductName(item);
    const subtotal = item.price * item.quantity;

    return (
        <div className="grid gap-4 border-b border-slate-100 px-5 py-4 text-sm last:border-b-0 lg:grid-cols-[minmax(260px,1fr)_120px_120px_120px_120px] lg:items-center">
            <div className="flex min-w-0 gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-slate-200 bg-slate-50">
                    <img className="h-full w-full object-cover" src={getProductImage(item)} alt={productName} />
                </div>
                <div className="min-w-0">
                    <h3 className="line-clamp-2 font-semibold leading-5 text-slate-900">{productName}</h3>
                    <p className="mt-1 text-xs text-slate-500">Brand: {getBrand(item)}</p>
                    <p className="mt-1 text-xs text-slate-500">Variant: {getVariantLabel(item)}</p>
                    <button
                        className="mt-2 text-xs font-semibold text-red-500 transition hover:text-red-600 disabled:text-slate-300"
                        disabled={disabled}
                        onClick={() => onRemove(item._id)}
                        type="button"
                    >
                        Remove
                    </button>
                </div>
            </div>

            <div className="flex justify-between lg:block">
                <span className="font-semibold text-slate-500 lg:hidden">Price</span>
                <span className="font-semibold text-slate-900">{formatCurrency(item.price)}</span>
            </div>

            <div className="flex items-center justify-between lg:block">
                <span className="font-semibold text-slate-500 lg:hidden">Quantity</span>
                <QuantitySelector
                    disabled={disabled}
                    onChange={(quantity) => onQuantityChange(item._id, quantity)}
                    value={item.quantity}
                />
            </div>

            <div className="flex justify-between lg:block">
                <span className="font-semibold text-slate-500 lg:hidden">Availability</span>
                <span className="font-semibold text-emerald-600">In Stock</span>
            </div>

            <div className="flex justify-between lg:block">
                <span className="font-semibold text-slate-500 lg:hidden">Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
        </div>
    );
};

export default CartItem;
