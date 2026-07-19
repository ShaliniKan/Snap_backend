import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SectionState from "../components/common/SectionState";
import ImageZoom from "../components/product/ImageZoom";
import ProductDetailFooter from "../components/product/ProductDetailFooter";
import { useCartContext, buildCartProductKey } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProductById, resolveImageUrl } from "../services/productService";
import { getProductReviews, submitProductReview } from "../services/reviewService";
import { addToCart } from "../services/cartService";
import { checkPincode } from "../services/deliveryService";
import { ROUTES } from "../routes/routePaths";
import { findCartVariant, getAvailableSizes } from "../utils/productSizes";

const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
};

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addItem, addingProductKey } = useCartContext();
    const { isAuthenticated, user, openLogin } = useAuth();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [error, setError] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [reviewSuccess, setReviewSuccess] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [addError, setAddError] = useState("");
    const [activeTab, setActiveTab] = useState("details");
    const [pincode, setPincode] = useState("");
    const [pincodeMessage, setPincodeMessage] = useState("");
    const [isBuying, setIsBuying] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getProductById(productId);
                setProduct(data);

                const firstVariant = data.variants?.[0];
                setSelectedColor(firstVariant?.color || "");
                setSelectedSize("");
                setSelectedImage(data.images?.[0] || data.image || firstVariant?.image || "");
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
            if (!productId) return;

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

    const galleryImages = useMemo(() => {
        if (!product) return [];

        const images = [
            ...(product.images || []),
            ...(product.variants || []).map((variant) => variant.image).filter(Boolean),
        ]
            .filter(Boolean)
            .map(resolveImageUrl);

        return [...new Set(images)];
    }, [product]);

    const uniqueColors = useMemo(() => {
        return [...new Set((product?.variants || []).map((variant) => variant.color).filter(Boolean))];
    }, [product]);

    const availableSizes = useMemo(() => getAvailableSizes(product, selectedColor), [product, selectedColor]);
    const requiresSizeSelection = availableSizes.length > 0;
    const isSizeSelected = Boolean(selectedSize);

    const selectedVariant = useMemo(() => {
        return findCartVariant(product, selectedColor, selectedSize) || findCartVariant(product, selectedColor, "");
    }, [product, selectedColor, selectedSize]);

    const resolvedVariant = useMemo(() => {
        if (!selectedSize) {
            return null;
        }

        return findCartVariant(product, selectedColor, selectedSize) || findCartVariant(product, selectedColor, "");
    }, [product, selectedColor, selectedSize]);

    const displayPrice = selectedVariant?.discount_price || selectedVariant?.price || product?.sellingPrice || product?.price || 0;
    const originalPrice = selectedVariant?.price || product?.price || displayPrice;
    const hasDiscount = originalPrice > displayPrice;
    const discountPercent = hasDiscount
        ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
        : product?.discount || 0;

    const availableStock = selectedSize
        ? resolvedVariant?.stock_quantity ?? product?.quantity ?? 0
        : selectedVariant?.stock_quantity ?? product?.quantity ?? 0;
    const isAdding = addingProductKey === buildCartProductKey({
        productId: product?._id,
        variantId: resolvedVariant?._id || selectedVariant?._id || null,
    });

    const handleAddToCart = async () => {
        if (!product) return;

        if (!isSizeSelected) {
            setAddError("Please select a size before adding to cart.");
            return;
        }

        try {
            setAddError("");
            await addItem({
                productId: product._id,
                variantId: resolvedVariant?._id || null,
                quantity,
                size: selectedSize,
                color: selectedColor || resolvedVariant?.color || "",
            });
        } catch (err) {
            setAddError(err.response?.data?.message || "We could not add this item to cart.");
        }
    };

    const handleBuyNow = async () => {
        if (!product) return;

        if (!isSizeSelected) {
            setAddError("Please select a size before proceeding to checkout.");
            return;
        }

        if (!isAuthenticated) {
            openLogin();
            return;
        }

        try {
            setIsBuying(true);
            setAddError("");
            await addToCart({
                productId: product._id,
                variantId: resolvedVariant?._id || null,
                quantity,
                size: selectedSize,
                color: selectedColor || resolvedVariant?.color || "",
            });
            navigate(`${ROUTES.customer.cart}?checkout=1`);
        } catch (err) {
            setAddError(err.response?.data?.message || "We could not proceed to checkout.");
        } finally {
            setIsBuying(false);
        }
    };

    const handlePincodeCheck = async () => {
        if (!/^\d{6}$/.test(pincode)) {
            setPincodeMessage("Enter a valid 6-digit pincode");
            return;
        }

        try {
            const result = await checkPincode(pincode);
            setPincodeMessage(
                result?.serviceable
                    ? `Generally delivered in ${result.estimatedDays || 5} - ${(result.estimatedDays || 5) + 4} days`
                    : "Delivery not available for this pincode"
            );
        } catch (err) {
            setPincodeMessage("Could not verify pincode");
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

    const quickLinks = [
        { label: "Product Type", value: product?.categoryName || "Men's T-Shirts & Polos" },
        { label: "Brand", value: product?.brand || "ApnaMart" },
        { label: "Fit", value: "Regular Fit" },
        { label: "Pattern", value: "Striped" },
        { label: "SleevesLength", value: "Half Sleeves" },
        { label: "Size", value: selectedSize || selectedVariant?.size || "Free Size" },
        { label: "Pattern or Print Type", value: "Colorblock" },
        { label: "Color", value: selectedColor || selectedVariant?.color || "Standard" },
        { label: "Pack", value: "Pack of 1" },
        { label: "Fabric", value: "Cotton Blend" },
    ];

    const highlightsColumns = [
        [
            product?.brand || "ApnaMart",
            { label: "Pattern", value: "Striped" },
            { label: "Sleeves Length", value: "Half Sleeves" },
            {
                type: "note",
                text: "The product may vary from the images due to various reasons like monitor setting or photographic lighting sources or handiwork & craftsmanship.",
            },
        ],
        [
            { label: "Fabric", value: "Cotton Blend" },
            { label: "Fit", value: "Regular Fit" },
            { label: "Number of Pocket", value: "No Pocket" },
            { label: "Product Length", value: "Regular" },
            { label: "No. of Items inside", value: "1" },
        ],
        [
            { label: "Color", value: selectedColor || selectedVariant?.color || "Standard" },
            { label: "Pack", value: "Pack of 1" },
            { label: "Pattern or Print Type", value: "Colorblock" },
            { label: "Season", value: "Summer" },
            { label: "SUPC", value: `SDL${product?._id?.slice(-9)?.toUpperCase() || "018227525"}` },
        ],
    ];

    const footerTabs = [
        { id: "details", label: "Item Details", targetId: "product-description" },
        { id: "reviews", label: "Ratings & Reviews", targetId: "product-reviews" },
        { id: "questions", label: "Questions & Answers", targetId: "product-questions" },
    ];

    const scrollToFooterSection = (targetId) => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab.id);

        if (tab.id === "details") {
            document.getElementById("product-detail-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }

        scrollToFooterSection(tab.targetId);
    };

    const renderHighlightItem = (item, index) => {
        if (typeof item === "string") {
            return (
                <li key={`brand-${index}`} className="text-[13px] leading-[22px] text-[#757575]">
                    {item}
                </li>
            );
        }

        if (item.type === "note") {
            return (
                <li key={`note-${index}`} className="list-none pt-1 text-[13px] leading-[22px] text-[#757575]">
                    {item.text}
                </li>
            );
        }

        return (
            <li key={`${item.label}-${index}`} className="text-[13px] leading-[22px] text-[#757575]">
                {item.label}: {item.value}
            </li>
        );
    };

    const scrollToReviews = () => {
        scrollToFooterSection("product-reviews");
    };

    if (loading) {
        return <SectionState>Loading product details...</SectionState>;
    }

    if (error || !product) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-10">
                <SectionState variant="error">{error || "Product not found."}</SectionState>
                <Link className="mt-4 inline-flex text-sm font-semibold text-[#e40145]" to={ROUTES.public.home}>
                    Back to home
                </Link>
            </div>
        );
    }

    return (
        <>
            <main className="mx-auto max-w-[1200px] bg-white px-4 py-4 sm:px-6 lg:px-8">
                <nav className="text-xs text-slate-500">
                    <Link to={ROUTES.public.home} className="hover:text-[#e40145]">Home</Link>
                    <span className="mx-1.5">/</span>
                    <span className="text-slate-600">{product.name}</span>
                </nav>

                <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
                    <section className="flex gap-3">
                        {galleryImages.length > 0 && (
                            <div className="flex w-16 shrink-0 flex-col gap-2">
                                {galleryImages.map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        onClick={() => setSelectedImage(image)}
                                        className={`aspect-square overflow-hidden border ${
                                            selectedImage === image ? "border-[#2f82c6]" : "border-slate-200"
                                        }`}
                                    >
                                        <img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <ImageZoom
                            src={selectedImage || product.image}
                            alt={product.name}
                            className="aspect-[4/5] min-h-[420px] flex-1"
                        />
                    </section>

                    <section>
                        <div className="flex items-start justify-between gap-4">
                            <h1 className="text-xl font-normal leading-7 text-slate-900 sm:text-2xl">{product.name}</h1>
                            {product.brand && (
                                <div className="shrink-0 rounded border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-wide">
                                    {product.brand}
                                </div>
                            )}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                            <span className="rounded-sm bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                                {Number(product.rating || 0).toFixed(1)} ★
                            </span>
                            <button type="button" className="text-[#2f82c6] hover:underline" onClick={scrollToReviews}>
                                ({Number(product.rating || 0).toFixed(1)}) {product.ratingCount || 0} Ratings
                            </button>
                            <span className="text-slate-400">|</span>
                            <span className="text-slate-500">{reviews.length} Review{reviews.length === 1 ? "" : "s"}</span>
                        </div>

                        <div className="mt-4 border-t border-slate-100 pt-4">
                            {hasDiscount && (
                                <p className="text-sm text-slate-400 line-through">
                                    MRP {formatCurrency(originalPrice)} (Inclusive of all taxes)
                                </p>
                            )}
                            <div className="mt-1 flex flex-wrap items-center gap-3">
                                <span className="text-3xl font-bold text-[#e40145]">{formatCurrency(displayPrice)}</span>
                                {hasDiscount && (
                                    <span className="rounded border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600">
                                        {discountPercent}% OFF
                                    </span>
                                )}
                            </div>
                        </div>

                        {uniqueColors.length > 0 && (
                            <div className="mt-6">
                                <p className="text-sm font-semibold text-slate-800">Color</p>
                                <div className="mt-2 flex flex-wrap gap-3">
                                    {uniqueColors.map((color) => {
                                        const variant = product.variants.find((entry) => entry.color === color);
                                        const isSelected = selectedColor === color;

                                        return (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedColor(color);
                                                    setSelectedSize("");
                                                    setAddError("");
                                                    if (variant?.image) {
                                                        setSelectedImage(variant.image);
                                                    } else {
                                                        setSelectedImage(product.images?.[0] || product.image || "");
                                                    }
                                                }}
                                                className={`flex w-[52px] flex-col items-center border p-1 ${
                                                    isSelected ? "border-[#2f82c6]" : "border-transparent"
                                                }`}
                                            >
                                                {variant?.image ? (
                                                    <img
                                                        alt={color}
                                                        className="h-16 w-full object-cover"
                                                        src={variant.image}
                                                    />
                                                ) : (
                                                    <span className="flex h-16 w-full items-center justify-center bg-slate-100 text-[10px] text-slate-600">
                                                        {color}
                                                    </span>
                                                )}
                                                <span className="mt-1 w-full truncate text-center text-[11px] text-[#757575]">
                                                    {color}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {requiresSizeSelection && (
                            <div className="mt-6">
                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-semibold text-slate-800">Size</p>
                                    <button type="button" className="text-xs text-[#2f82c6] hover:underline">
                                        Size Chart
                                    </button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {availableSizes.map((size) => {
                                        const isSelected = selectedSize === size;

                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedSize(size);
                                                    setAddError("");
                                                }}
                                                className={`min-w-[44px] rounded-sm border px-3 py-2 text-sm font-medium ${
                                                    isSelected
                                                        ? "border-[#2f82c6] text-[#2f82c6]"
                                                        : "border-slate-300 text-slate-700 hover:border-slate-400"
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                                {!selectedSize && (
                                    <p className="mt-2 text-xs text-[#e40046]">Please select a size to add this item to cart.</p>
                                )}
                            </div>
                        )}

                        {addError && (
                            <p className="mt-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{addError}</p>
                        )}

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                className="h-12 flex-1 rounded-sm bg-[#333333] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-black disabled:opacity-60"
                                onClick={handleAddToCart}
                                disabled={isAdding || availableStock <= 0 || !isSizeSelected}
                            >
                                {isAdding ? "Adding..." : "Add to Cart"}
                            </button>
                            <button
                                type="button"
                                className="h-12 flex-1 rounded-sm bg-[#e40145] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#c9003c] disabled:opacity-60"
                                onClick={handleBuyNow}
                                disabled={isBuying || availableStock <= 0 || !isSizeSelected}
                            >
                                {isBuying ? "Processing..." : "Buy Now"}
                            </button>
                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-4">
                            <p className="text-sm font-semibold text-slate-800">Delivery</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                                <input
                                    value={pincode}
                                    onChange={(event) => setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                                    className="w-28 border-b border-slate-400 bg-transparent px-1 py-1 outline-none"
                                    placeholder="pincode"
                                />
                                <button
                                    type="button"
                                    onClick={handlePincodeCheck}
                                    className="rounded-sm bg-[#333333] px-4 py-1.5 text-xs font-bold uppercase text-white"
                                >
                                    Check
                                </button>
                            </div>
                            {pincodeMessage && <p className="mt-2 text-xs text-slate-500">{pincodeMessage}</p>}
                            {!pincodeMessage && (
                                <p className="mt-2 text-xs text-slate-500">Generally delivered in 5 - 9 days</p>
                            )}
                        </div>
                    </section>
                </div>

                <div id="product-detail-tabs" className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
                    <section>
                        <div className="flex border-b border-[#e0e0e0]">
                            {footerTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleTabClick(tab)}
                                    className={`border-b-2 px-5 py-3 text-[14px] font-normal transition ${
                                        activeTab === tab.id
                                            ? "border-[#e40046] text-[#212121]"
                                            : "border-transparent text-[#757575] hover:text-[#212121]"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="py-2">
                            <div className="border-b border-[#eeeeee]">
                                <div className="flex items-center gap-3 py-4">
                                    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center border border-[#bdbdbd] text-[12px] leading-none text-[#616161]">
                                        −
                                    </span>
                                    <h3 className="text-[15px] font-normal text-[#424242]">Highlights</h3>
                                </div>

                                <div className="grid gap-6 pb-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {highlightsColumns.map((column, columnIndex) => (
                                        <ul key={`column-${columnIndex}`} className="list-disc space-y-1 pl-5 marker:text-[#bdbdbd]">
                                            {column.map((item, itemIndex) => renderHighlightItem(item, itemIndex))}
                                        </ul>
                                    ))}
                                </div>
                            </div>

                            <div className="border-b border-[#eeeeee]">
                                <div className="flex items-center gap-3 py-4">
                                    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center border border-[#bdbdbd] text-[12px] leading-none text-[#616161]">
                                        −
                                    </span>
                                    <h3 className="text-[15px] font-normal text-[#424242]">Other Specifications</h3>
                                </div>

                                <div className="pb-6 pl-[30px]">
                                    <h4 className="text-[14px] font-normal text-[#424242]">Other Details</h4>
                                    <p className="mt-3 text-[13px] leading-[22px] text-[#757575]">
                                        {product.description ||
                                            "Premium quality product crafted for everyday comfort and style. Refer to size chart before ordering."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className="hidden lg:block">
                        <div className="rounded-sm border border-slate-200 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Sold by</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">ApnaMart Seller</p>
                            <p className="mt-1 text-xs text-slate-500">4.1 ★ seller rating</p>
                            <Link to={ROUTES.public.sell} className="mt-2 inline-block text-sm text-[#2f82c6] hover:underline">
                                View Store &gt;
                            </Link>
                        </div>

                        {product.brand && (
                            <div className="mt-4 rounded-sm border border-slate-200 p-4 text-center">
                                <p className="text-2xl font-bold uppercase">{product.brand}</p>
                                <Link to={ROUTES.public.products} className="mt-2 inline-block text-xs text-[#2f82c6] hover:underline">
                                    More From {product.brand} &gt;
                                </Link>
                            </div>
                        )}
                    </aside>
                </div>
            </main>

            <ProductDetailFooter
                availableStock={availableStock}
                displayPrice={displayPrice}
                formatCurrency={formatCurrency}
                galleryImages={galleryImages}
                hasDiscount={hasDiscount}
                isAuthenticated={isAuthenticated}
                isBuying={isBuying}
                isSubmittingReview={isSubmittingReview}
                onBuyNow={handleBuyNow}
                onSubmitReview={handleSubmitReview}
                originalPrice={originalPrice}
                product={product}
                quickLinks={quickLinks}
                reviewError={reviewError}
                reviewSuccess={reviewSuccess}
                reviews={reviews}
                reviewsLoading={reviewsLoading}
                selectedImage={selectedImage}
                user={user}
            />
        </>
    );
};
export default ProductDetail;
