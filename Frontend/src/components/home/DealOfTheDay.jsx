import { Link } from "react-router-dom";
import HorizontalCarousel from "./HorizontalCarousel";
import SectionState from "../common/SectionState";
import { getDealOffer, getSubcategoryImage } from "../../utils/homeContent";

const DealOfTheDay = ({ deals = [], loading = false, error = "" }) => {
    if (loading) {
        return (
            <section className="bg-white py-8">
                <SectionState>Loading deals...</SectionState>
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

    if (deals.length === 0) {
        return null;
    }

    return (
        <section className="bg-white py-8">
            <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-12">
                <h2 className="self-stretch text-snap-title text-center text-[40px] font-black leading-[125.5%] capitalize mb-6">
                    Deal Of The Day
                </h2>

                <HorizontalCarousel>
                    {deals.map((deal, index) => (
                        <Link
                            key={deal._id}
                            to={`/categories/${deal.parentCategoryId}/subcategories/${deal._id}`}
                            className="group w-[170px] shrink-0 sm:w-[190px]"
                        >
                            <div className="overflow-hidden rounded-2xl border-[3px] border-red-600 bg-white shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <img
                                        src={getSubcategoryImage(deal.itemName, deal.parentName)}
                                        alt={deal.itemName}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-2 pb-10 pt-8">
                                        <p className="line-clamp-2 text-center text-[13px] font-medium leading-tight text-white">
                                            {deal.itemName}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-red-600 px-2 py-2 text-center">
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-white sm:text-xs">
                                        {getDealOffer(index)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </HorizontalCarousel>
            </div>
        </section>
    );
};

export default DealOfTheDay;
