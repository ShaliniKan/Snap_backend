import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCategoryDetails, getSubcategories } from "../../services/categoryService";
import { getProducts } from "../../services/productService";
import ProductGrid from "./ProductGrid";
import ProductGridSkeleton from "./ProductGridSkeleton";

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

const ProductListingPage = ({ mode = "category" }) => {
    const { categoryId, subcategoryId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const isSubcategoryView = mode === "subcategory" && Boolean(subcategoryId);

    const [category, setCategory] = useState(null);
    const [categoryTree, setCategoryTree] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState(initialFilters);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
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
        setPage(1);
        setActiveCategoryId(subcategoryId || categoryId || "");
    }, [categoryId, subcategoryId, location.search]);

    useEffect(() => {
        const loadCategoryData = async () => {
            try {
                const [categoryData, subcategories] = await Promise.all([
                    isSubcategoryView ? getCategoryDetails(subcategoryId) : getCategoryDetails(categoryId),
                    getSubcategories(categoryId),
                ]);
                setCategory(categoryData);
                setCategoryTree(subcategories || []);
            } catch (err) {
                setCategory(null);
                setCategoryTree([]);
            }
        };

        if (categoryId) {
            loadCategoryData();
        }
    }, [categoryId, subcategoryId, isSubcategoryView]);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError("");

            try {
                const query = new URLSearchParams();
                query.set("page", "1");
                query.set("limit", "20");
                if (isSubcategoryView) {
                    query.set("subcategory", subcategoryId);
                } else if (categoryId) {
                    query.set("category", categoryId);
                }
                if (filters.search) query.set("search", filters.search);
                if (filters.minPrice) query.set("minPrice", filters.minPrice);
                if (filters.maxPrice) query.set("maxPrice", filters.maxPrice);
                if (filters.rating) query.set("rating", filters.rating);
                if (filters.discount) query.set("discount", filters.discount);
                if (filters.brand) query.set("brand", filters.brand);
                if (filters.color) query.set("color", filters.color);
                if (filters.size) query.set("size", filters.size);
                if (filters.sort) query.set("sort", filters.sort);
                if (filters.inStock) query.set("inStock", filters.inStock);

                const data = await getProducts(query.toString());
                setProducts(data.products || []);
                setHasMore((data.pagination?.page || 1) < (data.pagination?.pages || 1));
            } catch (err) {
                setError("We could not load products right now.");
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            loadProducts();
        }
    }, [categoryId, subcategoryId, isSubcategoryView, filters.search, filters.minPrice, filters.maxPrice, filters.rating, filters.discount, filters.brand, filters.color, filters.size, filters.sort, filters.inStock]);

    const handleFilterChange = (field, value) => {
        setFilters((current) => ({ ...current, [field]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams(location.search);
        if (filters.search) params.set("search", filters.search); else params.delete("search");
        if (filters.minPrice) params.set("minPrice", filters.minPrice); else params.delete("minPrice");
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice); else params.delete("maxPrice");
        if (filters.rating) params.set("rating", filters.rating); else params.delete("rating");
        if (filters.discount) params.set("discount", filters.discount); else params.delete("discount");
        if (filters.brand) params.set("brand", filters.brand); else params.delete("brand");
        if (filters.color) params.set("color", filters.color); else params.delete("color");
        if (filters.size) params.set("size", filters.size); else params.delete("size");
        if (filters.sort) params.set("sort", filters.sort); else params.delete("sort");
        if (filters.inStock) params.set("inStock", filters.inStock); else params.delete("inStock");

        navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : "" });
    };

    const clearFilters = () => {
        setFilters(initialFilters);
        navigate({ pathname: location.pathname, search: "" });
    };

    const sidebar = useMemo(() => (
        <aside className="hidden w-[260px] shrink-0 rounded-sm border border-slate-200 bg-white p-4 shadow-sm lg:block">
            <div className="border-b border-slate-200 pb-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Category</h3>
                <div className="mt-3 space-y-2">
                    {categoryTree.map((item) => (
                        <button
                            key={item._id}
                            type="button"
                            onClick={() => navigate(`/categories/${categoryId}/subcategories/${item._id}`)}
                            className={`flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm ${activeCategoryId === item._id ? "bg-red-50 text-red-500" : "text-slate-700 hover:bg-slate-50"}`}
                        >
                            <span>{item.itemName}</span>
                            <span className="text-xs text-slate-400">{item.children?.length || 0}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4 border-b border-slate-200 pb-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Price</h3>
                <div className="mt-3 flex gap-2">
                    <input type="number" value={filters.minPrice} onChange={(e) => handleFilterChange("minPrice", e.target.value)} className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm" placeholder="Min" />
                    <input type="number" value={filters.maxPrice} onChange={(e) => handleFilterChange("maxPrice", e.target.value)} className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm" placeholder="Max" />
                </div>
                <button type="button" onClick={applyFilters} className="mt-3 w-full rounded-sm bg-red-500 px-3 py-2 text-sm font-semibold text-white">Apply</button>
            </div>

            <div className="mt-4 border-b border-slate-200 pb-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Customer Rating</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                    {[4,3,2,1].map((value) => (
                        <label key={value} className="flex items-center gap-2">
                            <input type="radio" name="rating" checked={filters.rating === String(value)} onChange={() => handleFilterChange("rating", String(value))} />
                            <span>{"★".repeat(value)}{value < 5 ? "☆".repeat(5 - value) : ""} & Up</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mt-4 border-b border-slate-200 pb-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Discount</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                    {[10,20,30,40,50,60,70].map((value) => (
                        <label key={value} className="flex items-center gap-2">
                            <input type="checkbox" checked={filters.discount === String(value)} onChange={() => handleFilterChange("discount", filters.discount === String(value) ? "" : String(value))} />
                            <span>{value}%+</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    ), [activeCategoryId, categoryId, categoryTree, filters, applyFilters, navigate]);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <nav className="text-sm text-slate-500">
                    <span>Home</span>
                    <span className="mx-2">&gt;</span>
                    <span>{category?.itemName || "Category"}</span>
                </nav>

                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {['Kitchen', 'Shoes', 'Kurti Set', 'Tshirt', 'Sports Shoes', 'Wall Stickers'].map((chip) => (
                        <button key={chip} type="button" className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">{chip}</button>
                    ))}
                </div>

                <section className="mt-6 rounded-sm border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold text-slate-900">{loading ? "Loading category..." : category?.itemName || "Category"}</h1>
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{products.length}+ Items</span>
                            </div>
                            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                                <label className="flex items-center gap-2 rounded-sm border border-slate-200 px-3 py-2 text-sm text-slate-600">
                                    <span>🔎</span>
                                    <input value={filters.search} onChange={(e) => handleFilterChange("search", e.target.value)} placeholder="Search within category" className="outline-none" />
                                </label>
                                <div className="flex gap-2">
                                    <input value={filters.minPrice} onChange={(e) => handleFilterChange("minPrice", e.target.value)} placeholder="Pincode" className="w-28 rounded-sm border border-slate-200 px-3 py-2 text-sm" />
                                    <button type="button" className="rounded-sm border border-red-500 px-3 py-2 text-sm font-semibold text-red-500">Check</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm text-slate-600">Sort by</label>
                            <select value={filters.sort} onChange={(e) => handleFilterChange("sort", e.target.value)} className="rounded-sm border border-slate-200 px-3 py-2 text-sm text-slate-700">
                                {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                            </select>
                        </div>
                    </div>
                </section>

                <div className="mt-6 flex gap-6">
                    {sidebar}

                    <div className="flex-1">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-slate-600">Showing {products.length} products</p>
                            <button type="button" className="rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 lg:hidden">Filters</button>
                        </div>

                        {loading ? (
                            <ProductGridSkeleton count={8} />
                        ) : error ? (
                            <div className="rounded-sm border border-slate-200 bg-white p-8 text-center">
                                <p className="text-lg font-semibold text-slate-900">We hit a snag</p>
                                <p className="mt-2 text-sm text-slate-600">{error}</p>
                                <button type="button" onClick={applyFilters} className="mt-4 rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white">Retry</button>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="rounded-sm border border-slate-200 bg-white p-10 text-center">
                                <p className="text-lg font-semibold text-slate-900">No Products Found</p>
                                <p className="mt-2 text-sm text-slate-600">Try clearing the filters to see more results.</p>
                                <button type="button" onClick={clearFilters} className="mt-4 rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white">Clear Filters</button>
                            </div>
                        ) : (
                            <>
                                <ProductGrid products={products} />
                                {hasMore && (
                                    <div className="mt-6 text-center">
                                        <button type="button" onClick={() => setPage((current) => current + 1)} className="rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Load More</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListingPage;