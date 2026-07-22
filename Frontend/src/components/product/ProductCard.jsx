import { Link } from "react-router-dom";
import { useCartContext, buildCartProductKey } from "../../context/CartContext";
import { ROUTES } from "../../routes/routePaths";

const ProductCard = ({ product, showAddToCart = true }) => {
    const { addItem, addingProductKey } = useCartContext();
    const productId = product?._id || product?.id;
    const variantId = product?.variants?.[0]?._id || product?.variantId || null;
    const productKey = buildCartProductKey({ productId, variantId });
    const isAdding = addingProductKey === productKey;

    const handleAdd = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            await addItem({
                productId,
                variantId,
                quantity: 1,
            });
        } catch (e) {
            // CartContext surfaces errors in the overlay.
        }
    };

    const hasDiscount = (product?.discount || 0) > 0 && (product?.sellingPrice || 0) < (product?.price || 0);
    const productPath = ROUTES.public.productDetails.replace(":productId", product?._id || product?.id);

    return (
        <article className="group flex h-full flex-col rounded-sm border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <Link to={productPath} className="block">
                <div className="aspect-square overflow-hidden rounded-sm bg-slate-100">
                    <img
                        src={product?.image}
                        alt={product?.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                </div>

                <div className="mt-3 flex flex-1 flex-col">
                    <h3 className="line-clamp-2 min-h-[40px] text-sm font-medium leading-5 text-slate-800">{product?.name}</h3>

                    <div className="mt-2 flex items-center gap-2">
                        <span className="rounded-sm bg-emerald-600 px-1.5 py-0.5 text-xs font-semibold text-white">{Number(product?.rating || 0).toFixed(1)} ★</span>
                        <span className="text-xs text-slate-500">({product?.ratingCount || 0})</span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-baseline gap-2">
                        <span className="text-base font-semibold text-slate-900">&#8377;{product?.sellingPrice || 0}</span>
                        {hasDiscount && (
                            <>
                                <span className="text-xs text-slate-400 line-through">&#8377;{product?.price || 0}</span>
                                <span className="text-xs font-semibold text-emerald-600">{product?.discount}% OFF</span>
                            </>
                        )}
                    </div>
                </div>
            </Link>

            {showAddToCart && (
                <button
                    className="mt-4 h-9 w-full rounded-sm bg-red-500 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                    onClick={handleAdd}
                    disabled={isAdding}
                    type="button"
                >
                    {isAdding ? "Adding..." : "Add to Cart"}
                </button>
            )}
        </article>
    );
};

export default ProductCard;
