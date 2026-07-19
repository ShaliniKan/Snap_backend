import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";

const ListingProductCard = ({ product }) => {
    const productPath = ROUTES.public.productDetails.replace(":productId", product._id);
    const hasDiscount = (product?.discount || 0) > 0 && (product?.sellingPrice || 0) < (product?.price || 0);

    return (
        <article className="group bg-white">
            <Link to={productPath} className="block">
                <div className="aspect-[3/4] overflow-hidden border border-slate-100 bg-slate-50">
                    <img
                        src={product?.image}
                        alt={product?.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                </div>

                <div className="px-1 py-3">
                    <h3 className="line-clamp-2 min-h-[40px] text-[13px] leading-5 text-slate-800">
                        {product?.name}
                    </h3>

                    <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="rounded-sm bg-emerald-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                            {Number(product?.rating || 0).toFixed(1)} ★
                        </span>
                        <span className="text-[11px] text-slate-500">({product?.ratingCount || 0})</span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-base font-bold text-slate-900">&#8377;{product?.sellingPrice || 0}</span>
                        {hasDiscount && (
                            <>
                                <span className="text-xs text-slate-400 line-through">&#8377;{product?.price || 0}</span>
                                <span className="text-xs font-semibold text-emerald-600">{product?.discount}% off</span>
                            </>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default ListingProductCard;
