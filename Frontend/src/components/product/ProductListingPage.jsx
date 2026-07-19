import { useCallback, useEffect, useMemo, useState } from "react";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { getCategoryDetails, getSubcategories } from "../../services/categoryService";

import { getProducts } from "../../services/productService";

import { checkPincode } from "../../services/deliveryService";

import ListingProductGrid from "./ListingProductGrid";
import ListingGridSkeleton from "./ListingGridSkeleton";
import ProductListingFilters from "./ProductListingFilters";



const initialFilters = {

    search: "",

    minPrice: "",

    maxPrice: "",

    rating: "",

    discount: "",

    brand: "",

    color: "",

    size: "",

    sort: "popularity",

    inStock: "",

};



const sortOptions = [

    { value: "popularity", label: "Popularity" },

    { value: "newest", label: "Newest" },

    { value: "price_low", label: "Price Low to High" },

    { value: "price_high", label: "Price High to Low" },

    { value: "discount", label: "Discount" },

    { value: "rating", label: "Customer Rating" },

];



const trendingSearches = [

    "kitchen product",

    "shoes for men",

    "kurti set",

    "tshirt",

    "sports shoes",

    "wall stickers",

    "saree",

    "watch",

];

const TreeDash = () => (
    <span aria-hidden="true" className="mt-[7px] inline-block h-px w-2.5 shrink-0 bg-slate-400" />
);

const SidebarTreeRow = ({ label, count, isActive, onClick, level = 1, as = "button" }) => {
    const indentClass = level === 1 ? "" : level === 2 ? "pl-4" : "pl-8";
    const showDash = level <= 2;
    const textClass = isActive
        ? "font-semibold text-[#e40145]"
        : level === 1
          ? "font-bold text-slate-900 hover:text-[#e40145]"
          : "text-slate-700 hover:text-[#e40145]";
    const countClass = isActive ? "text-[#e40145]" : "text-slate-400";

    const className = `flex w-full items-start justify-between gap-2 py-1.5 text-left text-[13px] leading-5 ${indentClass} ${textClass}`;

    const content = (
        <>
            <span className="flex min-w-0 items-start gap-1.5">
                {showDash ? <TreeDash /> : null}
                <span className="min-w-0 break-words">{label}</span>
            </span>
            {typeof count === "number" ? (
                <span className={`shrink-0 text-xs ${countClass}`}>{count}</span>
            ) : null}
        </>
    );

    if (as === "link") {
        return (
            <Link to={onClick} className={className}>
                {content}
            </Link>
        );
    }

    return (
        <button type="button" onClick={onClick} className={className}>
            {content}
        </button>
    );
};

const ProductListingPage = ({ mode = "category" }) => {

    const { categoryId, subcategoryId } = useParams();

    const location = useLocation();

    const navigate = useNavigate();

    const isSubcategoryView = mode === "subcategory" && Boolean(subcategoryId);



    const [parentCategory, setParentCategory] = useState(null);

    const [category, setCategory] = useState(null);

    const [categoryTree, setCategoryTree] = useState([]);

    const [products, setProducts] = useState([]);

    const [totalItems, setTotalItems] = useState(0);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [filters, setFilters] = useState(initialFilters);

    const [hasMore, setHasMore] = useState(true);

    const [pincode, setPincode] = useState("");

    const [pincodeMessage, setPincodeMessage] = useState("");
    const [activeCategoryId, setActiveCategoryId] = useState(subcategoryId || categoryId || "");



    useEffect(() => {

        const params = new URLSearchParams(location.search);

        setFilters({

            search: params.get("search") || "",

            minPrice: params.get("minPrice") || "",

            maxPrice: params.get("maxPrice") || "",

            rating: params.get("rating") || "",

            discount: params.get("discount") || "",

            brand: params.get("brand") || "",

            color: params.get("color") || "",

            size: params.get("size") || "",

            sort: params.get("sort") || "popularity",

            inStock: params.get("inStock") || "",

        });

        setActiveCategoryId(subcategoryId || categoryId || "");

    }, [categoryId, subcategoryId, location.search]);



    useEffect(() => {

        const loadCategoryData = async () => {

            try {

                const [parentData, subcategories] = await Promise.all([

                    getCategoryDetails(categoryId),

                    getSubcategories(categoryId),

                ]);

                setParentCategory(parentData);

                setCategoryTree(subcategories || []);



                if (isSubcategoryView) {

                    const currentData = await getCategoryDetails(subcategoryId);

                    setCategory(currentData);

                } else {

                    setCategory(parentData);

                }

            } catch (err) {

                setParentCategory(null);

                setCategory(null);

                setCategoryTree([]);

            }

        };



        if (categoryId) {

            loadCategoryData();

        }

    }, [categoryId, subcategoryId, isSubcategoryView]);



    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const params = new URLSearchParams(location.search);
            const query = new URLSearchParams();
            query.set("page", "1");
            query.set("limit", "24");
            if (isSubcategoryView) {
                query.set("subcategory", subcategoryId);
            } else if (categoryId) {
                query.set("category", categoryId);
            }

            ["search", "minPrice", "maxPrice", "rating", "discount", "brand", "color", "size", "sort", "inStock"].forEach((key) => {
                const value = params.get(key);
                if (value) query.set(key, value);
            });

            const data = await getProducts(query.toString());
            setProducts(data.products || []);
            setTotalItems(data.pagination?.total || data.products?.length || 0);
            setHasMore((data.pagination?.page || 1) < (data.pagination?.pages || 1));
        } catch (err) {
            setError("We could not load products right now.");
        } finally {
            setLoading(false);
        }
    }, [categoryId, subcategoryId, isSubcategoryView, location.search]);



    useEffect(() => {

        if (categoryId) {

            loadProducts();

        }

    }, [categoryId, loadProducts]);



    const handleFilterChange = (field, value) => {

        setFilters((current) => ({ ...current, [field]: value }));

    };



    const applyFilters = () => {

        const params = new URLSearchParams(location.search);

        Object.entries(filters).forEach(([key, value]) => {

            if (value) params.set(key, value);

            else params.delete(key);

        });

        navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : "" });

    };

    const updateFilters = (updates) => {

        const nextFilters = { ...filters, ...updates };

        setFilters(nextFilters);

        const params = new URLSearchParams(location.search);

        Object.entries(nextFilters).forEach(([key, value]) => {

            if (value) params.set(key, value);

            else params.delete(key);

        });

        navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : "" });

    };



    const clearFilters = () => {

        setFilters(initialFilters);

        navigate({ pathname: location.pathname, search: "" });

    };



    const handleSortChange = (value) => {

        handleFilterChange("sort", value);

        const params = new URLSearchParams(location.search);

        params.set("sort", value);

        navigate({ pathname: location.pathname, search: `?${params.toString()}` });

    };



    const handlePincodeCheck = async () => {

        if (!/^\d{6}$/.test(pincode)) {

            setPincodeMessage("Enter a valid 6-digit pincode");

            return;

        }



        try {

            const result = await checkPincode(pincode);

            setPincodeMessage(result?.serviceable ? `Delivery in ${result.estimatedDays || 3}-${(result.estimatedDays || 3) + 2} days` : "Not serviceable");

        } catch (err) {

            setPincodeMessage("Could not verify pincode");

        }

    };



    const itemCountLabel = totalItems > 10000 ? "10000+ Items" : `${totalItems || products.length} Items`;

    const parentProductCount = categoryTree.reduce((sum, item) => sum + (item.productCount ?? 0), 0);

    const sidebar = (
        <aside className="hidden w-[240px] shrink-0 bg-white lg:block">
            <div className="border-b border-slate-200 pb-4">
                <SidebarTreeRow
                    as="link"
                    count={parentProductCount}
                    isActive={!isSubcategoryView && activeCategoryId === categoryId}
                    label={parentCategory?.itemName || "Category"}
                    level={1}
                    onClick={`/categories/${categoryId}`}
                />
                <div>
                    {categoryTree.map((item) => {
                        const isActive = activeCategoryId === item._id;

                        return (
                            <SidebarTreeRow
                                key={item._id}
                                count={item.productCount ?? 0}
                                isActive={isActive}
                                label={item.itemName}
                                level={2}
                                onClick={() => navigate(`/categories/${categoryId}/subcategories/${item._id}`)}
                            />
                        );
                    })}
                </div>
            </div>

            <ProductListingFilters
                filters={filters}
                onApplyFilters={applyFilters}
                onFilterChange={handleFilterChange}
                onUpdateFilters={updateFilters}
                products={products}
            />
        </aside>
    );

    const breadcrumbItems = useMemo(() => {

        const items = [{ label: "Home", to: "/" }];



        if (parentCategory?.itemName) {

            items.push({ label: parentCategory.itemName, to: `/categories/${categoryId}` });

        }



        if (isSubcategoryView && category?.itemName) {

            items.push({ label: category.itemName, to: location.pathname });

        }



        return items;

    }, [parentCategory, category, categoryId, isSubcategoryView, location.pathname]);



    return (

        <div className="min-h-screen bg-page">

            <div className="mx-auto max-w-page bg-white px-4 py-3 sm:px-6 lg:px-8">

                <nav className="text-xs text-slate-500">

                    {breadcrumbItems.map((item, index) => (

                        <span key={item.label}>

                            {index > 0 && <span className="mx-1.5">/</span>}

                            {index === breadcrumbItems.length - 1 ? (

                                <span className="text-slate-600">{item.label}</span>

                            ) : (

                                <Link to={item.to} className="hover:text-[#e40145]">

                                    {item.label}

                                </Link>

                            )}

                        </span>

                    ))}

                </nav>



                <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                    <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="shrink-0 font-semibold text-gray-500 text-sm">Trending searches:</span>

                    {trendingSearches.map((chip) => (

                        <button

                            key={chip}

                            type="button"

                            onClick={() => navigate(`/products?search=${encodeURIComponent(chip)}`)}

                            className="shrink-0 border border-slate-300 bg-white px-3 py-1 text-xs text-slate-600 hover:border-[#e40145] hover:text-[#e40145]"

                        >

                            {chip}

                        </button>

                    ))}

                </div>

            </div>



            <div className="mx-auto max-w-page px-4 pb-10 sm:px-6 lg:px-8">

                <div className="flex gap-6 bg-white px-0 lg:px-4 lg:pt-4">

                    {sidebar}



                    <div className="min-w-0 flex-1 bg-white px-2 py-4 lg:px-4">

                        <div className="border-b border-slate-200 pb-4">

                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between px-[15px] pb-[10px] pt-0 text-[22px]">

                                <div className="flex flex-wrap items-baseline gap-2">

                                    <h1 className="text-xl font-normal text-slate-900 sm:text-2xl">

                                        {loading ? "Loading..." : category?.itemName || "Category"}

                                    </h1>

                                    <span className="text-sm text-slate-500">({itemCountLabel})</span>

                                </div>



                                <div className="flex flex-wrap items-center gap-40">

                                    <label className="flex h-9 min-w-[220px] items-center gap-2 rounded-sm px-3 text-sm text-slate-500">

                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">

                                            <circle cx="11" cy="11" r="7" />

                                            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />

                                        </svg>

                                        <input

                                            value={filters.search}

                                            onChange={(event) => handleFilterChange("search", event.target.value)}

                                            onKeyDown={(event) => event.key === "Enter" && applyFilters()}

                                            placeholder="Search within category"

                                            className="w-full outline-none"

                                        />

                                    </label>



                                    <div className="flex items-center gap-2 text-sm text-gray-400 border border-slate-300 pl-3">

                                        <span>Sort by:</span>

                                        <select

                                            value={filters.sort}

                                            onChange={(event) => handleSortChange(event.target.value)}

                                            className="rounded-sm px-3 py-1.5 text-sm text-slate-700 outline-none"

                                        >

                                            {sortOptions.map((option) => (

                                                <option key={option.value} value={option.value}>

                                                    {option.label}

                                                </option>

                                            ))}

                                        </select>

                                    </div>

                                </div>

                            </div>



                            <div className="mt-0 mx-[15px] mb-[10px] flex flex-wrap items-center gap-2 text-sm">

                                <span className="text-gray-400">Enter your pincode</span>

                                <input

                                    value={pincode}

                                    onChange={(event) => setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))}

                                    className="w-20  bg-transparent px-1 py-0.5 text-sm outline-none"

                                    placeholder=" "

                                />

                                <button

                                    type="button"

                                    onClick={handlePincodeCheck}

                                    className="text-sm font-semibold text-[#e40145] hover:underline"

                                >

                                    Check

                                </button>

                                {pincodeMessage && <span className="text-xs text-slate-500">{pincodeMessage}</span>}

                            </div>

                        </div>



                        <div className="mt-4">

                            {loading ? (

                                <ListingGridSkeleton count={8} />

                            ) : error ? (

                                <div className="py-12 text-center">

                                    <p className="text-lg font-semibold text-slate-900">We hit a snag</p>

                                    <p className="mt-2 text-sm text-slate-600">{error}</p>

                                    <button

                                        type="button"

                                        onClick={loadProducts}

                                        className="mt-4 rounded-sm bg-[#e40145] px-4 py-2 text-sm font-semibold text-white"

                                    >

                                        Retry

                                    </button>

                                </div>

                            ) : products.length === 0 ? (

                                <div className="py-12 text-center">

                                    <p className="text-lg font-semibold text-slate-900">No Products Found</p>

                                    <p className="mt-2 text-sm text-slate-600">Try clearing the filters to see more results.</p>

                                    <button

                                        type="button"

                                        onClick={clearFilters}

                                        className="mt-4 rounded-sm bg-[#e40145] px-4 py-2 text-sm font-semibold text-white"

                                    >

                                        Clear Filters

                                    </button>

                                </div>

                            ) : (

                                <>

                                    <ListingProductGrid products={products} />

                                    {hasMore && (

                                        <div className="mt-8 text-center">

                                            <button

                                                type="button"

                                                onClick={applyFilters}

                                                className="rounded-sm border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"

                                            >

                                                Load More

                                            </button>

                                        </div>

                                    )}

                                </>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};



export default ProductListingPage;

