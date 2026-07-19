import { useState } from "react";
import HeroBannerCarousel from "../components/home/HeroBannerCarousel";
import DealOfTheDay from "../components/home/DealOfTheDay";
import AdvertisementBanner from "../components/home/AdvertisementBanner";
import NewArrivals from "../components/home/NewArrivals";
import ProductGrid from "../components/product/ProductGrid";
import ProductGridSkeleton from "../components/product/ProductGridSkeleton";
import SectionState from "../components/common/SectionState";
import useDealOfTheDay from "../hooks/useDealOfTheDay";
import useNewArrivals from "../hooks/useNewArrivals";
import useProducts from "../hooks/useProducts";

const INITIAL_PRODUCT_COUNT = 12;
const PRODUCT_LOAD_STEP = 12;

const Home = () => {
    const [visibleProductCount, setVisibleProductCount] = useState(INITIAL_PRODUCT_COUNT);
    const { deals, loading: dealsLoading, error: dealsError } = useDealOfTheDay();
    const { products: newArrivals, loading: arrivalsLoading, error: arrivalsError } = useNewArrivals(10);
    const { products, loading: productsLoading, error: productsError } = useProducts();
    const visibleProducts = products.slice(0, visibleProductCount);
    const hasMoreProducts = visibleProductCount < products.length;

    return (
        <>
            <HeroBannerCarousel />
            <div className="mx-auto mt-[48px] mb-[60px] w-[98%] max-w-[1880px] overflow-hidden rounded-[28px]">
                <img
                    src="/freedeliverystripwebupdated.avif"
                    alt="Offer Strip"
                    className="block h-auto w-full"
                />
            </div>

            <DealOfTheDay deals={deals} loading={dealsLoading} error={dealsError} />

            <AdvertisementBanner />

            <NewArrivals products={newArrivals} loading={arrivalsLoading} error={arrivalsError} />

            <div className="mx-auto my-8 w-[97%] overflow-hidden rounded-xl border border-snapborder-muted bg-white shadow-sm">
                <img
                    src="/appdownloadbannerhomeweb_4.avif"
                    alt="Download Snapdeal App"
                    className="block w-full h-auto"
                />
            </div>

            <main className="mx-auto max-w-page px-4 py-8 sm:px-6 lg:px-12">
                <section>
                    <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-end gap-4">
                        <span aria-hidden="true" />
                        <p className="text-center text-[40px] font-black capitalize leading-[125.5%] text-snap-title">
                            Explore More on Snapdeal
                        </p>
                        <a href="/products" className="justify-self-end text-sm font-semibold text-red-500">
                            View all
                        </a>
                    </div>

                    {productsLoading ? (
                        <ProductGridSkeleton />
                    ) : productsError ? (
                        <SectionState variant="error">{productsError}</SectionState>
                    ) : products.length === 0 ? (
                        <SectionState>No products available right now.</SectionState>
                    ) : (
                        <>
                            <ProductGrid products={visibleProducts} />

                            {hasMoreProducts && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        className="rounded-sm border border-brand-primary bg-brand-primary px-10 py-2.5 text-sm font-semibold uppercase tracking-wide text-white"
                                        onClick={() =>
                                            setVisibleProductCount((current) => current + PRODUCT_LOAD_STEP)
                                        }
                                        type="button"
                                    >
                                        View More
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>
        </>
    );
};

export default Home;
