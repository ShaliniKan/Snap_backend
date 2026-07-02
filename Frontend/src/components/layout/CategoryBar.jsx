const CategoryBar = () => {
return(
    <div className="flex items-center gap-4 px-12 py-3 bg-white text-sm font-medium">
                <button className="flex items-center gap-2 px-3 py-2 hover:text-red-500">
                    <img src="/men.jpg" className="w-9 h-710 rounded-full object-cover border border-gray-200"/>
                    Men's Fashion
                </button>
                
                <button className="flex items-center gap-2 px-3 py-2 hover:text-red-500">
                    <img src="/men.jpg" className="w-9 h-710 rounded-full object-cover border border-gray-200"/>
                    Women's Fashion
                </button>

               <button className="flex items-center gap-2 px-3 py-2 hover:text-red-500">
                    <img src="/men.jpg" className="w-9 h-710 rounded-full object-cover border border-gray-200"/>
                    Electronics
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:text-red-500">
                    <img src="/men.jpg" className="w-9 h-710 rounded-full object-cover border border-gray-200"/>
                    Beauty & Health
                </button>

                <button className="flex items-center gap-2 px-3 py-2 hover:text-red-500">
                    <img src="/men.jpg" className="w-9 h-710 rounded-full object-cover border border-gray-200"/>
                    Home & Kitchen
                </button>
    </div>
);
};
export default CategoryBar;
