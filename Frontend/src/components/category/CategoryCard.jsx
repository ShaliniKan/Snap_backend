import { Link } from "react-router-dom";
import { getCategoryImage } from "../../utils/sortCategories";

const CategoryCard = ({ category, to }) => {
    const categoryName = category.itemName || "Category";

    return (
        <Link
            className="group overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            to={to}
        >
            <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                    src={getCategoryImage(categoryName)}
                    alt={categoryName}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
            </div>
            <div className="px-3 py-3 text-center">
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">{categoryName}</h3>
                <p className="mt-1 text-xs font-medium text-red-500">Shop now</p>
            </div>
        </Link>
    );
};

export default CategoryCard;
