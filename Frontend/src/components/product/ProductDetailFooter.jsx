import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SectionState from "../common/SectionState";
import ReviewForm from "../review/ReviewForm";
import ReviewList from "../review/ReviewList";
import { SiteFooterBottom, TrustBadgesBar } from "../layout/HomeFooter";
import { resolveImageUrl } from "../../services/productService";
import { ROUTES } from "../../routes/routePaths";

const STICKY_TOP_OFFSET = 96;

const AccordionSection = ({ title, children, defaultOpen = true }) => {
    return (
        <div className="border-b border-[#e0e0e0] bg-white last:border-b-0">
            <div className="flex items-center gap-3 px-5 py-4">
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center border border-[#bdbdbd] text-[12px] leading-none text-[#616161]">
                    −
                </span>
                <h3 className="text-[22px] font-normal leading-none text-[#212121]">{title}</h3>
            </div>
            {defaultOpen && (
                <div className="px-5 pb-5 pl-[46px] text-[13px] leading-[22px] text-[#757575]">{children}</div>
            )}
        </div>
    );
};

const FooterCard = ({ children, className = "", id, title, titleExtra }) => (
    <section className={`border border-[#e0e0e0] bg-white ${className}`} id={id}>
        {(title || titleExtra) && (
            <div className="flex items-center justify-between border-b border-[#e0e0e0] px-4 py-3">
                {title && <h3 className="text-[15px] font-normal text-[#212121]">{title}</h3>}
                {titleExtra}
            </div>
        )}
        <div className="p-4">{children}</div>
    </section>
);

const QuickLinkItem = ({ label, value }) => (
    <button className="flex w-full items-center justify-between gap-3 py-2.5 text-left" type="button">
        <span className="text-[12px] text-[#9e9e9e]">
            {label}: <span className="font-semibold text-[#212121]">{value}</span>
        </span>
        <span className="text-[12px] text-[#bdbdbd]">&gt;</span>
    </button>
);

const StickyProductCard = ({
    product,
    image,
    displayPrice,
    originalPrice,
    hasDiscount,
    formatCurrency,
    onBuyNow,
    isBuying,
    availableStock,
}) => (
    <div className="border border-[#e0e0e0] bg-white p-4">
        <img alt={product.name} className="mx-auto aspect-[4/5] w-full max-w-[180px] object-cover" src={image} />
        <p className="mt-3 line-clamp-2 text-[12px] leading-[18px] text-[#424242]">{product.name}</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="text-[18px] font-normal text-[#e40046]">{formatCurrency(displayPrice)}</span>
            {hasDiscount && (
                <span className="text-[12px] text-[#9e9e9e] line-through">{formatCurrency(originalPrice)}</span>
            )}
        </div>
        <button
            className="mt-4 h-10 w-full bg-[#e40046] text-[13px] font-bold uppercase tracking-wide text-white transition hover:bg-[#c9003c] disabled:opacity-60"
            disabled={isBuying || availableStock <= 0}
            onClick={onBuyNow}
            type="button"
        >
            {isBuying ? "Processing..." : "Buy Now"}
        </button>
    </div>
);

const ProductDetailFooter = ({
    product,
    selectedImage,
    displayPrice,
    originalPrice,
    hasDiscount,
    formatCurrency,
    quickLinks = [],
    galleryImages = [],
    reviews = [],
    reviewsLoading = false,
    reviewError = "",
    reviewSuccess = "",
    isSubmittingReview = false,
    isAuthenticated = false,
    user,
    onSubmitReview,
    onBuyNow,
    isBuying = false,
    availableStock = 0,
}) => {
    const stickyZoneRef = useRef(null);
    const sellerEndRef = useRef(null);
    const asideRef = useRef(null);
    const [asideStyle, setAsideStyle] = useState({});
    const selfieImages = galleryImages.slice(0, 2);
    const sellerName = product?.vendorName || product?.brand || "ApnaMart Seller";
    const productImage = resolveImageUrl(selectedImage || product?.image);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        const updateStickyCard = () => {
            const zoneEl = stickyZoneRef.current;
            const endEl = sellerEndRef.current;
            const asideEl = asideRef.current;

            if (!zoneEl || !endEl || !asideEl || window.innerWidth < 1024) {
                setAsideStyle({});
                return;
            }

            const zoneRect = zoneEl.getBoundingClientRect();
            const endRect = endEl.getBoundingClientRect();
            const cardHeight = asideEl.offsetHeight;
            const cardWidth = 260;
            const containerWidth = Math.min(window.innerWidth, 1200);
            const horizontalInset = Math.max(16, (window.innerWidth - containerWidth) / 2 + 32);

            if (zoneRect.top > STICKY_TOP_OFFSET) {
                setAsideStyle({
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: cardWidth,
                });
                return;
            }

            if (endRect.bottom <= STICKY_TOP_OFFSET + cardHeight + 16) {
                setAsideStyle({
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: cardWidth,
                });
                return;
            }

            setAsideStyle({
                position: "fixed",
                top: STICKY_TOP_OFFSET,
                right: horizontalInset,
                width: cardWidth,
                zIndex: 30,
            });
        };

        updateStickyCard();
        window.addEventListener("scroll", updateStickyCard, { passive: true });
        window.addEventListener("resize", updateStickyCard);

        return () => {
            window.removeEventListener("scroll", updateStickyCard);
            window.removeEventListener("resize", updateStickyCard);
        };
    }, [product?.name, displayPrice, hasDiscount, selectedImage]);

    return (
        <div className="bg-[#f5f5f5]">
            <div ref={stickyZoneRef} className="relative mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
                    <div className="min-w-0 space-y-5">
                        <div id="product-description" className="scroll-mt-28 overflow-hidden border border-[#e0e0e0] bg-white">
                            <AccordionSection title="Description">
                                <p>{product.description || product.name}</p>
                            </AccordionSection>
                            <AccordionSection title="Terms & Conditions">
                                <p>
                                    The images represent actual product though color of the image and product may slightly
                                    differ.
                                </p>
                                <p className="mt-3">
                                    Snapdeal does not select, edit, modify, alter, add or supplement the information,
                                    description and other specifications provided by the Seller.
                                </p>
                            </AccordionSection>
                        </div>

                        <FooterCard className="scroll-mt-28" id="product-item-details" title="Quick links">
                            <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                                {quickLinks.map((item) => (
                                    <QuickLinkItem key={item.label} label={item.label} value={item.value} />
                                ))}
                            </div>
                        </FooterCard>

                        {selfieImages.length > 0 && (
                            <FooterCard title={`Customer Product Selfies (${selfieImages.length})`}>
                                <div className="flex flex-wrap gap-3">
                                    {selfieImages.map((image, index) => (
                                        <img
                                            key={`${image}-${index}`}
                                            alt={`Customer selfie ${index + 1}`}
                                            className="h-[110px] w-[110px] border border-[#e0e0e0] object-cover"
                                            src={image}
                                        />
                                    ))}
                                </div>
                            </FooterCard>
                        )}

                        <FooterCard className="scroll-mt-28" id="product-reviews" title="Ratings & Reviews">
                            {reviewSuccess && (
                                <p className="mb-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-700">
                                    {reviewSuccess}
                                </p>
                            )}
                            {reviewError && (
                                <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-600">
                                    {reviewError}
                                </p>
                            )}

                            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                                {isAuthenticated && user?.role === "customer" ? (
                                    <ReviewForm isSubmitting={isSubmittingReview} onSubmit={onSubmitReview} />
                                ) : (
                                    <div className="border border-[#e0e0e0] bg-[#fafafa] p-4 text-[13px] text-[#757575]">
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
                        </FooterCard>

                        <FooterCard className="scroll-mt-28" id="product-questions" title="Questions & Answers">
                            <div className="bg-[#f5f5f5] px-4 py-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-[14px] font-normal text-[#212121]">Have a Question?</p>
                                        <p className="mt-1 text-[12px] leading-[18px] text-[#757575]">
                                            Get answers from experts and customers who have used this item.
                                        </p>
                                    </div>
                                    <button
                                        className="shrink-0 bg-[#333333] px-5 py-2 text-[11px] font-bold uppercase tracking-wide text-white"
                                        type="button"
                                    >
                                        Ask a Question
                                    </button>
                                </div>
                            </div>
                            <p className="mt-4 text-[13px] text-[#757575]">
                                No questions yet. Be the first to ask about this product.
                            </p>
                        </FooterCard>

                        <div ref={sellerEndRef}>
                            <FooterCard
                                id="product-seller-details"
                                title="Seller Details"
                                titleExtra={
                                    <Link
                                        className="bg-[#e40046] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white"
                                        to={ROUTES.public.sell}
                                    >
                                        View Store
                                    </Link>
                                }
                            >
                                <div className="flex items-start gap-4 border-b border-[#eeeeee] pb-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e0e0e0] bg-[#fafafa] text-lg">
                                        🏪
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-normal text-[#212121]">{sellerName}</p>
                                        <p className="mt-1 text-[12px] text-[#ffb300]">★★★★☆ (4.1)</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-[12px] leading-[18px] text-[#757575]">
                                    Expand your business to millions of customers.{" "}
                                    <Link className="text-[#2f82c6] hover:underline" to={ROUTES.public.sell}>
                                        Sell this item on Snapdeal
                                    </Link>
                                </p>
                            </FooterCard>
                        </div>
                    </div>

                    <aside aria-hidden="true" className="hidden lg:block" />
                </div>

                <aside ref={asideRef} className="hidden lg:block" style={asideStyle}>
                    <StickyProductCard
                        availableStock={availableStock}
                        displayPrice={displayPrice}
                        formatCurrency={formatCurrency}
                        hasDiscount={hasDiscount}
                        image={productImage}
                        isBuying={isBuying}
                        onBuyNow={onBuyNow}
                        originalPrice={originalPrice}
                        product={product}
                    />
                </aside>
            </div>

            <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
                <TrustBadgesBar embedded productStyle />
            </div>

            <div className="mx-auto max-w-[1200px] px-4 pb-10 pl-6 sm:pl-8 sm:pr-6 lg:pl-10 lg:pr-8">
                <SiteFooterBottom embedded productStyle showSubscribe />
            </div>

            <button
                aria-label="Scroll to top"
                className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#333333] text-white shadow-lg transition hover:bg-black"
                onClick={scrollToTop}
                type="button"
            >
                ↑
            </button>
        </div>
    );
};

export default ProductDetailFooter;
