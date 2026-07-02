const TopHeader = () =>{
return(
        <div className=" w-full">
        <div className="flex justify-between items-center self-stretch py-2.5 px-12 bg-[#ffe7ea]">
                    <div className="flex flex-1 items-center gap-6 text-xs font-bold"> 
                        <div> FREE Delivery</div>
                        <div>7 Days Easy Returns</div>
                        <div>Best Prices</div>
                    </div>
                   
            <div className="flex items-center gap-6">
                <a className="flex items-center cursor-pointer gap-2" href=" ">
                    <img src="/blog.png" alt="Blog" className="w-5 h-5"/>
                    <span className="">
                        Our Blog
                    </span>
                </a>
                <a className="flex items-center cursor-pointer gap-2" href=" ">
                    <img src="/help.png" alt="Help Center" className="w-7 h-7"/>
                    <span className="">
                         Help Center
                    </span>
                </a>
                <a className="flex items-center cursor-pointer gap-2" href=" ">
                                <img src="/sell deal.png" alt="Help Center" className="w-7 h-7"/>
                                <span className="">
                                    Sell On Deal
                                </span>
                </a>
            </div>
        </div>
        </div>
);
};

export default TopHeader;