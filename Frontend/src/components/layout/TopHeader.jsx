import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";

const TopHeader = ({ variant = "home" }) => {
    if (variant === "store") {
        return (
            <div className="w-full bg-brand-store text-white" data-store-top-header="true">
                <div className="mx-auto flex max-w-page flex-col gap-2 px-4 py-2 text-xs font-medium sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-12">
                    <span>India&apos;s Leading Online Shopping Destination</span>
                    <div className="flex flex-wrap items-center gap-4">
                        <a className="hover:underline" href="/">
                            Our Blog
                        </a>
                        <a className="hover:underline" href="/">
                            Help Center
                        </a>
                        <Link className="hover:underline" to={ROUTES.public.sell}>
                            Sell On Snapdeal
                        </Link>
                        <a className="flex items-center gap-1.5 hover:underline" href="/">
                            <span>Download App</span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-home-top">
            <div className="mx-auto flex max-w-home-content items-center justify-between px-4 py-[10px] sm:px-6">
                <div className="flex flex-wrap items-center gap-3">
                    <div>FREE Delivery</div>
                    <div className="mx-2 w-4 border-t border-dashed border-[#2b2b2b] rotate-90"></div>
                    <div>7 Days Easy Returns</div>
                    <div className="mx-2 w-4 border-t border-dashed border-[#2b2b2b] rotate-90"></div>
                    <div>Best Prices</div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <a className="flex items-center gap-3 " href="/">
                        <img src="/blog.png" alt="Blog" className="h-5 w-5" />
                        <span className="text-[15px] font-medium leading-6 text-[#2b2b2b]">Our Blog</span>
                    </a>
                    <a className="flex items-center gap-3" href="/">
                        <img src="/help.png" alt="Help Center" className="h-6 w-6" />
                        <span className="text-[15px] font-medium leading-6 text-[#2b2b2b]">Help Center</span>
                    </a>
                    <Link className="flex items-center gap-3 hover:text-red-600" to={ROUTES.public.sell}>
                        <img src="/sell-deal.png" alt="Sell Deal" className="h-7 w-7" />
                        <span className="text-[15px] font-medium leading-6 text-[#2b2b2b]">Sell On Snapdeal</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopHeader;
