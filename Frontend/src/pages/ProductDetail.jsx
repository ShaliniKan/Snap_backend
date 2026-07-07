import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TopHeader from "../components/layout/TopHeader";
import Navbar from "../components/layout/Navbar";
import SectionState from "../components/common/SectionState";
import ReviewForm from "../components/review/ReviewForm";
import ReviewList from "../components/review/ReviewList";
import { useCartContext, buildCartProductKey } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProductById } from "../services/productService";
import { getProductReviews, submitProductReview } from "../services/reviewService";
import { ROUTES } from "../routes/routePaths";

const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
};

const ProductDetail = () => {
    const { productId } = useParams();
    const { addItem, addingProductKey } = useCartContext();
    const { isAuthenticated, user } = useAuth();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [error, setError] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [reviewSuccess, setReviewSuccess] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [selectedVariantId, setSelectedVariantId] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [addError, setAddError] = useState("");

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getProductById(productId);
                setProduct(data);
                setSelectedImage(data.images?.[0] || data.image);
                setSelectedVariantId(data.variants?.[0]?._id || "");
            } catch (err) {
                setError(err.response?.data?.message || "We could not load this product.");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId]);

    useEffect(() => {
        const loadReviews = async () => {
            if (!productId) {
                return;
            }

            setReviewsLoading(true);

            try {
                const data = await getProductReviews(productId);
                setReviews(data);
            } catch (err) {
                setReviewError(err.response?.data?.message || "Could not load reviews.");
            } finally {
                setReviewsLoading(false);
            }
        };

        loadReviews();
    }, [productId]);

    const selectedVariant = useMemo(() => {
        if (!product?.variants?.length) {
            return null;
        }

        return product.variants.find((variant) => variant._id === selectedVariantId) || product.variants[0];
    }, [product, selectedVariantId]);

    const displayPrice = selectedVariant?.discount_price || selectedVariant?.price || product?.sellingPrice || product?.price || 0;
    const originalPrice = selectedVariant?.price || product?.price || displayPrice;
    const hasDiscount = originalPrice > displayPrice;
    const discountPercent = hasDiscount
        ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
        : product?.discount || 0;

    const availableStock = selectedVariant?.stock_quantity ?? product?.quantity ?? 0;
    const isAdding = addingProductKey === buildCartProductKey({
        productId: product?._id,
        variantId: selectedVariant?._id || null,
    });
    const uniqueColors = [...new Set((product?.variants || []).map((variant) => variant.color).filter(Boolean))];
    const uniqueSizes = [...new Set((product?.variants || []).map((variant) => variant.size).filter(Boolean))];

    const handleAddToCart = async () => {
        if (!product) {
            return;
        }

        try {
            setAddError("");
            await addItem({
                productId: product._id,
                variantId: selectedVariant?._id || null,
                quantity,
            });
        } catch (err) {
            setAddError(err.response?.data?.message || "We could not add this item to cart.");
        }
    };

    const handleSubmitReview = async ({ rating, comment }) => {
        try {
            setIsSubmittingReview(true);
            setReviewError("");
            setReviewSuccess("");
            await submitProductReview(productId, { rating, comment });
            const data = await getProductReviews(productId);
            setReviews(data);
            const refreshedProduct = await getProductById(productId);
            setProduct(refreshedProduct);
            setReviewSuccess("Thank you for your review.");
        } catch (err) {
            setReviewError(err.response?.data?.message || "Could not submit review.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <TopHeader />
                <Navbar />
                <SectionState>Loading product details...</SectionState>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-slate-50">
                <TopHeader />
                <Navbar />
                <div className="mx-auto max-w-3xl px-4 py-10">
                    <SectionState variant="error">{error || "Product not found."}</SectionState>
                    <Link className="mt-4 inline-flex text-sm font-semibold text-red-500" to={ROUTES.public.home}>
                        Back to home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <TopHeader />
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <nav className="text-sm text-slate-500">
                    <Link to={ROUTES.public.home} className="hover:text-red-500">Home</Link>
                    <span className="mx-2">&gt;</span>
                    <span>{product.name}</span>
                </nav>

                <div className="mt-6 grid gap-8 rounded-sm border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <section>
                        <div className="aspect-square overflow-hidden rounded-sm bg-slate-100">
                            <img
                                src={selectedImage || product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {product.images?.length > 1 && (
                            <div className="mt-4 flex gap-3 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        onClick={() => setSelectedImage(image)}
                                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-sm border ${selectedImage === image ? "border-red-500" : "border-slate-200"}`}
                                    >
                                        <img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">Product Details</p>
                        <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{product.name}</h1>

                        {product.brand && (
                            <p className="mt-2 text-sm text-slate-500">Brand: {product.brand}</p>
                        )}

                        <div className="mt-4 flex items-center gap-2">
                            <span className="rounded-sm bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                                {Number(product.rating || 0).toFixed(1)} ★
                            </span>
                            <span className="text-sm text-slate-500">({product.ratingCount || 0} ratings)</span>
                        </div>

                        <div className="mt-5 flex flex-wrap items-end gap-3">
                            <span className="text-3xl font-semibold text-slate-900">{formatCurrency(displayPrice)}</span>
                            {hasDiscount && (
                                <>
                                    <span className="text-lg text-slate-400 line-through">{formatCurrency(originalPrice)}</span>
                                    <span className="text-sm font-semibold text-emerald-600">{discountPercent}% OFF</span>
                                </>
                            )}
                        </div>

                        <p className="mt-2 text-sm text-slate-600">
                            {availableStock > 0 ? `${availableStock} item(s) in stock` : "Out of stock"}
                        </p>

                        {uniqueColors.length > 0 && (
                            <div className="mt-6">
                                <p className="text-sm font-semibold text-slate-800">Color</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {uniqueColors.map((color) => {
                                        const variant = product.variants.find((entry) => entry.color === color);
                                        const isSelected = selectedVariant?.color === color;

                                        return (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedVariantId(variant?._id || "")}
                                                className={`rounded-sm border px-3 py-2 text-sm ${isSelected ? "border-red-500 bg-red-50 text-red-600" : "border-slate-200 text-slate-700"}`}
                                            >
                                                {color}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {uniqueSizes.length > 0 && (
                            <div className="mt-6">
                                <p className="text-sm font-semibold text-slate-800">Size</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {uniqueSizes.map((size) => {
                                        const variant = product.variants.find((entry) => entry.size === size);
                                        const isSelected = selectedVariant?.size === size;

                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setSelectedVariantId(variant?._id || "")}
                                                className={`rounded-sm border px-3 py-2 text-sm ${isSelected ? "border-red-500 bg-red-50 text-red-600" : "border-slate-200 text-slate-700"}`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex items-center gap-3">
                            <span className="text-sm font-semibold text-slate-800">Quantity</span>
                            <div className="flex h-10 items-center rounded-sm border border-slate-200">
                                <button
                                    type="button"
                                    className="h-full px-3 text-lg font-semibold text-slate-600 disabled:text-slate-300"
                                    disabled={quantity <= 1}
                                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                                >
                                    -
                                </button>
                                <span className="min-w-10 border-x border-slate-200 px-3 text-center text-sm font-semibold">{quantity}</span>
                                <button
                                    type="button"
                                    className="h-full px-3 text-lg font-semibold text-slate-600 disabled:text-slate-300"
                                    disabled={quantity >= availableStock}
                                    onClick={() => setQuantity((current) => Math.min(availableStock, current + 1))}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {addError && (
                            <p className="mt-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{addError}</p>
                        )}

                        <button
                            type="button"
                            className="mt-6 h-11 w-full rounded-sm bg-red-500 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60 sm:w-auto sm:px-10"
                            onClick={handleAddToCart}
                            disabled={isAdding || availableStock <= 0}
                        >
                            {isAdding ? "Adding..." : "Add to Cart"}
                        </button>

                        {product.description && (
                            <div className="mt-8 border-t border-slate-100 pt-6">
                                <h2 className="text-lg font-semibold text-slate-900">Description</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
                            </div>
                        )}
                    </section>
                </div>

                <section className="mt-8 rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Ratings & Reviews</p>
                            <h2 className="mt-1 text-xl font-semibold text-slate-900">Customer Reviews</h2>
                        </div>
                        <div className="rounded-sm bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">
                            {Number(product.rating || 0).toFixed(1)} ★ · {product.ratingCount || 0} reviews
                        </div>
                    </div>

                    {reviewSuccess && <p className="mt-4 rounded-sm border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{reviewSuccess}</p>}
                    {reviewError && <p className="mt-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{reviewError}</p>}

                    <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
                        {isAuthenticated && user?.role === "customer" ? (
                            <ReviewForm isSubmitting={isSubmittingReview} onSubmit={handleSubmitReview} />
                        ) : (
                            <div className="rounded-sm border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                                Login as a customer to write a review.
                            </div>
                        )}

                        <div>
                            {reviewsLoading ? (
                                <SectionState>Loading reviews...</SectionState>
                            ) : (
                                <ReviewList reviews={reviews} />
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProductDetail;
