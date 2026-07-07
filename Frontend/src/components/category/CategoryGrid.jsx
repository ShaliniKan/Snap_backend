import CategoryCard from "./CategoryCard";

const CategoryGrid = ({ categories, getCategoryPath }) => {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {categories.map((category) => (
                <CategoryCard
                    key={category._id}
                    category={category}
                    to={getCategoryPath(category)}
                />
            ))}
        </div>
    );
};

export default CategoryGrid;
