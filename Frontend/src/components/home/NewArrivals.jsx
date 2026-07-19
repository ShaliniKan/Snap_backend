import { Link } from "react-router-dom";
import HorizontalCarousel from "./HorizontalCarousel";
import SectionState from "../common/SectionState";
import { getNewArrivalPriceTag } from "../../utils/homeContent";
import { ROUTES } from "../../routes/routePaths";

const NewArrivals = ({ products = [], loading = false, error = "" }) => {
    if (loading) {
        return (
            <section className="bg-white py-8">
                <SectionState>Loading new arrivals...</SectionState>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-white py-8">
                <SectionState variant="error">{error}</SectionState>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="bg-white py-8">
            <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-12">
                <h2 className="self-stretch text-snap-title text-center text-[40px] font-black leading-[125.5%] capitalize mb-6">
                    New Arrivals
                </h2>

                <HorizontalCarousel>
                    {products.map((product, index) => {
                        const productPath = ROUTES.public.productDetails.replace(":productId", product._id);
                        const categoryLabel = product.subcategoryName || product.categoryName || product.name;

                        return (
                            <Link
                                key={product._id}
                                to={productPath}
                                className="group w-[170px] shrink-0 sm:w-[190px]"
                            >
                                <div className="rounded-2xl bg-[#fff8dc] p-2.5 shadow-sm">
                                    <div className="relative overflow-hidden rounded-xl">
                                        <div className="absolute right-0 top-0 z-10 flex items-center">
                                            <span className="rounded-bl-md bg-yellow-400 px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                                                New-In
                                            </span>
                                        </div>
                                        <div className="aspect-square overflow-hidden bg-white">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-3">
                                            <p className="line-clamp-2 text-center text-[12px] font-medium leading-tight text-white">
                                                {categoryLabel}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-2.5 text-center text-xs font-bold uppercase text-slate-900 sm:text-sm">
                                        {getNewArrivalPriceTag(index, product.sellingPrice)}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </HorizontalCarousel>
            </div>
        </section>
    );
};

export default NewArrivals;
