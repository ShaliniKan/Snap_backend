import { useMemo, useState } from "react";

const PRICE_SLIDER_MAX = 5000;
const PRICE_SLIDER_MIN = 0;

const RATING_OPTIONS = [
    { value: "4", stars: 4 },
    { value: "3", stars: 3 },
    { value: "2", stars: 2 },
    { value: "1", stars: 1 },
];

const DISCOUNT_OPTIONS = [
    { value: "10", label: "10% and above" },
    { value: "20", label: "20% and above" },
    { value: "30", label: "30% and above" },
    { value: "40", label: "40% and above" },
    { value: "50", label: "50% and above" },
];

const DEFAULT_COLOR_OPTIONS = ["Black", "White", "Blue", "Red", "Green", "Grey", "Pink", "Brown", "Beige", "Navy"];
const DEFAULT_SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL", "6", "7", "8", "9", "10", "11"];

const SidebarFilterSection = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-slate-200">
        <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-between py-3 text-left"
        >
            <span className="text-[13px] font-bold text-slate-900">{title}</span>
            <span aria-hidden="true" className="text-base leading-none text-slate-600">
                {isOpen ? "−" : "+"}
            </span>
        </button>
        {isOpen ? (
            <>
                <div className="border-t border-slate-200" />
                <div className="pb-4 pt-3">{children}</div>
            </>
        ) : null}
    </div>
);

const StarRating = ({ count }) => (
    <span aria-hidden="true" className="inline-flex text-[13px] leading-none">
        {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= count ? "text-amber-400" : "text-slate-300"}>
                ★
            </span>
        ))}
    </span>
);

const FilterRadioRow = ({ checked, onChange, children, count, name }) => (
    <label className="flex cursor-pointer items-center justify-between gap-2 py-1.5">
        <span className="flex min-w-0 items-center gap-2">
            <span
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                    checked ? "border-[#e40145]" : "border-slate-400"
                }`}
            >
                {checked ? <span className="h-1.5 w-1.5 rounded-full bg-[#e40145]" /> : null}
            </span>
            <span className="min-w-0 text-[13px] leading-5 text-slate-700">{children}</span>
        </span>
        {typeof count === "number" ? <span className="shrink-0 text-xs text-slate-400">{count}</span> : null}
        <input checked={checked} className="sr-only" name={name} onChange={onChange} type="radio" />
    </label>
);

const ProductListingFilters = ({ filters, products = [], onFilterChange, onApplyFilters, onUpdateFilters }) => {
    const [openSections, setOpenSections] = useState({
        price: true,
        rating: true,
        discount: false,
        color: false,
        size: false,
        brand: false,
    });

    const toggleSection = (section) => {
        setOpenSections((current) => ({ ...current, [section]: !current[section] }));
    };

    const priceMin = filters.minPrice !== "" ? Number(filters.minPrice) : PRICE_SLIDER_MIN;
    const priceMax = filters.maxPrice !== "" ? Number(filters.maxPrice) : PRICE_SLIDER_MAX;

    const facetCounts = useMemo(() => {
        const ratingCounts = { 4: 0, 3: 0, 2: 0, 1: 0 };
        const discountCounts = { 10: 0, 20: 0, 30: 0, 40: 0, 50: 0 };
        const colorCounts = {};
        const sizeCounts = {};
        const brandCounts = {};

        products.forEach((product) => {
            const rating = Math.floor(Number(product.rating || 0));
            RATING_OPTIONS.forEach((option) => {
                if (rating >= Number(option.value)) {
                    ratingCounts[option.value] += 1;
                }
            });

            const discount = Number(product.discount || 0);
            DISCOUNT_OPTIONS.forEach((option) => {
                if (discount >= Number(option.value)) {
                    discountCounts[option.value] += 1;
                }
            });

            if (product.brand) {
                brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
            }

            (product.variants || []).forEach((variant) => {
                if (variant.color) {
                    colorCounts[variant.color] = (colorCounts[variant.color] || 0) + 1;
                }
                if (variant.size) {
                    sizeCounts[variant.size] = (sizeCounts[variant.size] || 0) + 1;
                }
            });
        });

        return { ratingCounts, discountCounts, colorCounts, sizeCounts, brandCounts };
    }, [products]);

    const colorOptions = useMemo(() => {
        const dynamicColors = Object.keys(facetCounts.colorCounts);
        return [...new Set([...dynamicColors, ...DEFAULT_COLOR_OPTIONS])].slice(0, 12);
    }, [facetCounts.colorCounts]);

    const sizeOptions = useMemo(() => {
        const dynamicSizes = Object.keys(facetCounts.sizeCounts);
        return [...new Set([...dynamicSizes, ...DEFAULT_SIZE_OPTIONS])].slice(0, 12);
    }, [facetCounts.sizeCounts]);

    const brandOptions = useMemo(() => Object.keys(facetCounts.brandCounts).sort(), [facetCounts.brandCounts]);

    const applySingleFilter = (field, value) => {
        const nextValue = filters[field] === value ? "" : value;
        onUpdateFilters({ [field]: nextValue });
    };

    return (
        <div className="mt-4">
            <SidebarFilterSection isOpen={openSections.price} onToggle={() => toggleSection("price")} title="Price">
                <div className="px-1">
                    <input
                        className="h-1.5 w-full cursor-pointer accent-slate-900"
                        max={PRICE_SLIDER_MAX}
                        min={PRICE_SLIDER_MIN}
                        onChange={(event) => onFilterChange("maxPrice", event.target.value)}
                        type="range"
                        value={Math.min(priceMax, PRICE_SLIDER_MAX)}
                    />
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                        <span>Rs. {priceMin}</span>
                        <span>Rs. {priceMax}</span>
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                    <input
                        className="w-full rounded-sm border border-slate-300 px-2 py-1.5 text-xs text-slate-700 outline-none"
                        onChange={(event) => onFilterChange("minPrice", event.target.value)}
                        placeholder="Rs. Min"
                        type="number"
                        value={filters.minPrice}
                    />
                    <span className="text-xs text-slate-400">-</span>
                    <input
                        className="w-full rounded-sm border border-slate-300 px-2 py-1.5 text-xs text-slate-700 outline-none"
                        onChange={(event) => onFilterChange("maxPrice", event.target.value)}
                        placeholder="Rs. Max"
                        type="number"
                        value={filters.maxPrice}
                    />
                    <button
                        className="shrink-0 rounded-sm border border-slate-900 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-800 hover:bg-slate-50"
                        onClick={onApplyFilters}
                        type="button"
                    >
                        Go
                    </button>
                </div>
            </SidebarFilterSection>

            <SidebarFilterSection
                isOpen={openSections.rating}
                onToggle={() => toggleSection("rating")}
                title="Customer Rating"
            >
                <div>
                    {RATING_OPTIONS.map((option) => (
                        <FilterRadioRow
                            checked={filters.rating === option.value}
                            count={facetCounts.ratingCounts[option.value]}
                            key={option.value}
                            name="listing-rating"
                            onChange={() => applySingleFilter("rating", option.value)}
                        >
                            <span className="flex items-center gap-1.5">
                                <StarRating count={option.stars} />
                                <span>&amp; Up</span>
                            </span>
                        </FilterRadioRow>
                    ))}
                </div>
            </SidebarFilterSection>

            <SidebarFilterSection
                isOpen={openSections.discount}
                onToggle={() => toggleSection("discount")}
                title="Discount %"
            >
                <div>
                    {DISCOUNT_OPTIONS.map((option) => (
                        <FilterRadioRow
                            checked={filters.discount === option.value}
                            count={facetCounts.discountCounts[option.value]}
                            key={option.value}
                            name="listing-discount"
                            onChange={() => applySingleFilter("discount", option.value)}
                        >
                            {option.label}
                        </FilterRadioRow>
                    ))}
                </div>
            </SidebarFilterSection>

            <SidebarFilterSection isOpen={openSections.color} onToggle={() => toggleSection("color")} title="Colour">
                <div>
                    {colorOptions.map((color) => (
                        <FilterRadioRow
                            checked={filters.color?.toLowerCase() === color.toLowerCase()}
                            count={facetCounts.colorCounts[color] || 0}
                            key={color}
                            name="listing-color"
                            onChange={() => applySingleFilter("color", color)}
                        >
                            {color}
                        </FilterRadioRow>
                    ))}
                </div>
            </SidebarFilterSection>

            <SidebarFilterSection isOpen={openSections.size} onToggle={() => toggleSection("size")} title="Size">
                <div className="grid grid-cols-3 gap-1.5">
                    {sizeOptions.map((size) => (
                        <button
                            key={size}
                            className={`rounded-sm border px-2 py-1.5 text-xs ${
                                filters.size === size
                                    ? "border-[#e40145] bg-[#fff5f7] font-semibold text-[#e40145]"
                                    : "border-slate-300 text-slate-700 hover:border-[#e40145] hover:text-[#e40145]"
                            }`}
                            onClick={() => applySingleFilter("size", size)}
                            type="button"
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </SidebarFilterSection>

            <SidebarFilterSection isOpen={openSections.brand} onToggle={() => toggleSection("brand")} title="Brand">
                <div>
                    {brandOptions.length > 0 ? (
                        brandOptions.map((brand) => (
                            <FilterRadioRow
                                checked={filters.brand?.toLowerCase() === brand.toLowerCase()}
                                count={facetCounts.brandCounts[brand]}
                                key={brand}
                                name="listing-brand"
                                onChange={() => applySingleFilter("brand", brand)}
                            >
                                {brand}
                            </FilterRadioRow>
                        ))
                    ) : (
                        <p className="text-xs text-slate-500">No brands available for this category.</p>
                    )}
                    <FilterRadioRow
                        checked={filters.inStock === "true"}
                        name="listing-brand"
                        onChange={() => applySingleFilter("inStock", "true")}
                    >
                        In stock only
                    </FilterRadioRow>
                </div>
            </SidebarFilterSection>
        </div>
    );
};

export default ProductListingFilters;
