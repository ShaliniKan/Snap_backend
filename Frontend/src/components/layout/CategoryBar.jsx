const categories = [
    "Men's Fashion",
    "Women's Fashion",
    "Electronics",
    "Beauty & Health",
    "Home & Kitchen",
];

const CategoryBar = () => {
    return (
        <div className="flex items-center gap-4 overflow-x-auto bg-white px-4 py-3 text-sm font-medium sm:px-6 lg:px-12">
            {categories.map((category) => (
                <button
                    key={category}
                    className="flex shrink-0 items-center gap-2 px-3 py-2 hover:text-red-500"
                    type="button"
                >
                    <img
                        src="/men.jpg"
                        alt=""
                        className="h-9 w-9 rounded-full border border-gray-200 object-cover"
                    />
                    {category}
                </button>
            ))}
        </div>
    );
};

export default CategoryBar;
