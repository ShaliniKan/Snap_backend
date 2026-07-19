import QuantitySelector from "./QuantitySelector";
import { resolveImageUrl } from "../../services/productService";
import { getCartItemAttributesLine } from "../../utils/cartHelpers";

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
    const variantImage = item.variant_id?.image;
    const productImage = item.product_id?.images?.[0] || item.product_id?.image || item.product_id?.thumbnail;
    return resolveImageUrl(variantImage || productImage || "/banner1.jpg");
};

const CartItem = ({ item, disabled = false, onRemove, onQuantityChange }) => {
    const productName = getProductName(item);
    const subtotal = item.price * item.quantity;
    const attributesLine = getCartItemAttributesLine(item);

    return (
        <div className="grid gap-4 border-b border-[#eeeeee] px-5 py-4 text-sm last:border-b-0 lg:grid-cols-[minmax(260px,1fr)_120px_120px_120px_120px] lg:items-start">
            <div className="flex min-w-0 gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden border border-[#e0e0e0] bg-white">
                    <img className="h-full w-full object-cover" src={getProductImage(item)} alt={productName} />
                </div>
                <div className="min-w-0">
                    <h3 className="line-clamp-2 text-[13px] font-normal leading-5 text-[#212121]">{productName}</h3>
                    <p className="mt-2 text-[12px] leading-[18px] text-[#757575]">{attributesLine}</p>
                    <button
                        className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[#757575] transition hover:text-[#e40046] disabled:text-[#bdbdbd]"
                        disabled={disabled}
                        onClick={() => onRemove(item._id)}
                        type="button"
                    >
                        X Remove
                    </button>
                </div>
            </div>

            <div className="flex justify-between lg:block">
                <span className="font-normal text-[#757575] lg:hidden">Price</span>
                <span className="font-normal text-[#212121]">{formatCurrency(item.price)}</span>
            </div>

            <div className="flex items-center justify-between lg:block">
                <span className="font-normal text-[#757575] lg:hidden">Quantity</span>
                <QuantitySelector
                    disabled={disabled}
                    onChange={(quantity) => onQuantityChange(item._id, quantity)}
                    value={item.quantity}
                />
            </div>

            <div className="flex justify-between lg:block">
                <span className="font-normal text-[#757575] lg:hidden">Availability</span>
                <span className="font-normal text-emerald-600">In Stock</span>
            </div>

            <div className="flex justify-between lg:block">
                <span className="font-normal text-[#757575] lg:hidden">Subtotal</span>
                <span className="font-normal text-[#212121]">{formatCurrency(subtotal)}</span>
            </div>
        </div>
    );
};

export default CartItem;
