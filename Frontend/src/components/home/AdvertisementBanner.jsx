import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";

const AdvertisementBanner = () => {
    return (
        <section className="bg-white py-6">
            <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-12">
                <Link
                    to={ROUTES.public.products}
                    className="group block overflow-hidden rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                >
                    <div className="relative flex min-h-[160px] items-stretch overflow-hidden bg-black sm:min-h-[200px]">
                        <div className="relative z-10 flex w-full flex-col justify-center px-6 py-6 sm:w-[45%] sm:px-10">
                            <div className="mb-3 inline-flex w-fit rounded bg-red-600 px-3 py-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
                                    ApnaMart
                                </span>
                            </div>
                            <p className="text-lg font-medium text-white sm:text-xl">Shoes Haven</p>
                            <p className="mt-1 text-2xl font-bold uppercase text-white sm:text-4xl">Up to 65% Off</p>
                            <span className="mt-5 inline-flex w-fit rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-black transition group-hover:bg-slate-100 sm:text-sm">
                                Shop Now
                            </span>
                        </div>

                        <div className="absolute inset-y-0 right-0 w-[58%] bg-gradient-to-l from-zinc-300 via-zinc-200 to-transparent sm:w-[55%]">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.45),transparent_55%)]" />
                            <img
                                src="/footwear1.jpg"
                                alt="Footwear advertisement"
                                className="absolute bottom-0 right-4 h-[85%] w-auto max-w-[70%] object-contain object-bottom transition duration-500 group-hover:scale-105 sm:right-10"
                            />
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default AdvertisementBanner;
