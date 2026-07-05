const TopHeader = () => {
    return (
        <div className="w-full bg-[#ffe7ea]">
            <div className="flex flex-col gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-12">
                <div className="flex flex-wrap items-center gap-4">
                    <div>FREE Delivery</div>
                    <div>7 Days Easy Returns</div>
                    <div>Best Prices</div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <a className="flex items-center gap-2" href="/">
                        <img src="/blog.png" alt="Blog" className="h-5 w-5" />
                        <span>Our Blog</span>
                    </a>
                    <a className="flex items-center gap-2" href="/">
                        <img src="/help.png" alt="Help Center" className="h-6 w-6" />
                        <span>Help Center</span>
                    </a>
                    <a className="flex items-center gap-2" href="/">
                        <img src="/sell deal.png" alt="Sell on ApnaMart" className="h-6 w-6" />
                        <span>Sell On ApnaMart</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TopHeader;