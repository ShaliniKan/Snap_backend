import { Link } from "react-router-dom";
import { getMegaMenuColumns } from "../../utils/megaMenuSections";

const getSubcategoryPath = (categoryId, subcategoryId) => {
    return `/categories/${categoryId}/subcategories/${subcategoryId}`;
};

const ViewAllLink = ({ categoryId, subcategoryId, label = "View All", onNavigate }) => {
    if (!subcategoryId) {
        return null;
    }

    return (
        <Link
            className="mt-1 inline-block text-[13px] font-medium text-snaplink transition hover:text-snaplink-hover focus:outline-none"
            onClick={onNavigate}
            role="menuitem"
            to={getSubcategoryPath(categoryId, subcategoryId)}
        >
            {label} &gt;
        </Link>
    );
};
const MegaMenuSection = ({ section, categoryId, onNavigate }) => {
    const firstItemId = section.items[0]?._id;

    return (
        <div className=" min-w-[200px] border-b border-slate-200 py-4 last:border-b-0">
            <h3 className="mb-4 text-[13px] font-bold leading-5 text-slate-900">{section.title}</h3>
            <ul className="space-y-2">
                {section.items.map((subcategory) => (                    <li key={subcategory._id}>
                        <Link
                            className="block text-[13px] leading-5 text-slate-600 transition hover:text-brand-accent focus:outline-none"                            onClick={onNavigate}
                            role="menuitem"
                            to={getSubcategoryPath(categoryId, subcategory._id)}
                        >
                            {subcategory.itemName}
                        </Link>
                    </li>
                ))}
            </ul>
            <ViewAllLink categoryId={categoryId} onNavigate={onNavigate} subcategoryId={firstItemId} />
        </div>
    );
};

const MegaMenuPanel = ({
    activeCategory,
    subcategories = [],
    loading = false,
    error = "",
    onNavigate,
    className = "",
}) => {
    const columns = getMegaMenuColumns(activeCategory?.itemName, subcategories);

    if (!activeCategory) {
        return null;
    }

    return (
        <div className={`min-h-[150px] px-1 py-3 ${className}`}>
            {loading ? (
                <div className="flex h-30 items-center justify-center text-sm font-medium text-slate-500">
                    Loading subcategories...
                </div>
            ) : error ? (
                <div className="flex h-44 items-center justify-center text-sm font-medium text-red-500">
                    {error}
                </div>
            ) : columns.length === 0 ? (
                <div className="flex h-44 flex-col items-center justify-center text-center">
                    <p className="text-sm font-semibold text-slate-900">No subcategories available</p>
                    {subcategories[0] ? (
                        <ViewAllLink
                            categoryId={activeCategory._id}
                            label="View all products"
                            onNavigate={onNavigate}
                            subcategoryId={subcategories[0]._id}
                        />
                    ) : null}
                </div>
            ) : (                <div>
                    <p className="border-b border-slate-200 px-5 pb-3 text-[13px] font-bold text-slate-900">
                        {activeCategory.itemName}
                    </p>
                    <div className="flex divide-x divide-slate-200">
                        {columns.map((column, columnIndex) => (
                            <div className="shrink-0 px-5 py-1" key={`${activeCategory._id}-col-${columnIndex}`}>
                                {column.sections.map((section) => (
                                    <MegaMenuSection
                                        key={`${section.title}-${columnIndex}`}
                                        categoryId={activeCategory._id}
                                        onNavigate={onNavigate}
                                        section={section}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>    );
};

export default MegaMenuPanel;
