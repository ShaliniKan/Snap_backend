import { Link } from "react-router-dom";

const sectionLabels = ["Popular Categories", "Top Picks", "Trending Now", "More Choices", "Shop More"];

const getSubcategoryPath = (categoryId, subcategoryId) => {
    return `/categories/${categoryId}/subcategories/${subcategoryId}`;
};

const getColumns = (subcategories) => {
    if (subcategories.length === 0) {
        return [];
    }

    const columnCount = Math.min(5, Math.max(3, Math.ceil(subcategories.length / 4)));
    const itemsPerColumn = Math.ceil(subcategories.length / columnCount);

    return Array.from({ length: columnCount }, (_, index) => {
        const start = index * itemsPerColumn;
        return subcategories.slice(start, start + itemsPerColumn);
    }).filter((column) => column.length > 0);
};

const MegaMenu = ({
    activeCategory,
    subcategories = [],
    loading = false,
    error = "",
    isOpen = false,
    onMouseEnter,
    onMouseLeave,
}) => {
    const columns = getColumns(subcategories);

    if (!activeCategory) {
        return null;
    }

    return (
        <div
            aria-hidden={!isOpen}
            className={`absolute left-1/2 top-full z-50 hidden w-[min(1120px,calc(100vw-48px))] -translate-x-1/2 pt-2 transition duration-200 ease-out lg:block ${
                isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
            }`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-2xl"
                id="category-mega-menu"
                role="menu"
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-500">Shop by category</p>
                        <h2 className="mt-1 text-lg font-semibold text-slate-900">{activeCategory.itemName}</h2>
                    </div>
                    <Link
                        className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        role="menuitem"
                        to={`/categories/${activeCategory._id}`}
                    >
                        View All &gt;
                    </Link>
                </div>

                <div className="min-h-[220px] px-6 py-5">
                    {loading ? (
                        <div className="flex h-44 items-center justify-center text-sm font-medium text-slate-500">
                            Loading subcategories...
                        </div>
                    ) : error ? (
                        <div className="flex h-44 items-center justify-center text-sm font-medium text-red-500">
                            {error}
                        </div>
                    ) : columns.length === 0 ? (
                        <div className="flex h-44 flex-col items-center justify-center text-center">
                            <p className="text-sm font-semibold text-slate-900">No subcategories available</p>
                            <Link
                                className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                role="menuitem"
                                to={`/categories/${activeCategory._id}`}
                            >
                                View all products &gt;
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-0 divide-x divide-slate-100 xl:grid-cols-5">
                            {columns.map((column, columnIndex) => (
                                <div className="px-5 first:pl-0 last:pr-0" key={`${activeCategory._id}-${columnIndex}`}>
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            {sectionLabels[columnIndex] || sectionLabels[sectionLabels.length - 1]}
                                        </h3>
                                    </div>
                                    <ul className="space-y-1.5">
                                        {column.map((subcategory) => (
                                            <li key={subcategory._id}>
                                                <Link
                                                    className="block rounded-sm px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-red-500 focus:bg-slate-50 focus:text-red-500 focus:outline-none"
                                                    role="menuitem"
                                                    to={getSubcategoryPath(activeCategory._id, subcategory._id)}
                                                >
                                                    {subcategory.itemName}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
