import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SectionState from "../components/common/SectionState";
import ListingProductGrid from "../components/product/ListingProductGrid";
import ListingGridSkeleton from "../components/product/ListingGridSkeleton";
import { getProducts } from "../services/productService";

const sortOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "newest", label: "Newest" },
    { value: "price_low", label: "Price Low to High" },
    { value: "price_high", label: "Price High to Low" },
    { value: "discount", label: "Discount" },
    { value: "rating", label: "Customer Rating" },
];

const SearchProducts = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "popularity";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError("");

            try {
                const query = new URLSearchParams();
                query.set("page", "1");
                query.set("limit", "24");
                if (searchQuery) query.set("search", searchQuery);
                if (sort) query.set("sort", sort);

                const data = await getProducts(query.toString());
                setProducts(data.products || []);
            } catch (err) {
                setError("We could not load search results right now.");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [searchQuery, sort]);

    const pageTitle = useMemo(() => {
        if (searchQuery) {
            return `Results for "${searchQuery}"`;
        }

        return "All Products";
    }, [searchQuery]);

    return (
        <main className="mx-auto max-w-page bg-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">                    <div>
                        <h1 className="text-2xl font-normal text-slate-900">{pageTitle}</h1>
                        {!loading && (
                            <p className="mt-1 text-sm text-slate-500">{products.length} product(s) found</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>Sort by:</span>
                        <select
                            id="search-sort"
                            value={sort}
                            onChange={(event) => {
                                const nextParams = new URLSearchParams(searchParams);
                                nextParams.set("sort", event.target.value);
                                setSearchParams(nextParams);
                            }}
                            className="rounded-sm border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6">
                    {loading ? (
                        <ListingGridSkeleton count={8} />
                    ) : error ? (
                        <SectionState variant="error">{error}</SectionState>
                    ) : products.length === 0 ? (
                        <div className="py-12 text-center">
                            <h2 className="text-lg font-semibold text-slate-900">No products found</h2>
                            <p className="mt-2 text-sm text-slate-500">Try a different search term or browse categories from the home page.</p>
                        </div>
                    ) : (
                        <ListingProductGrid products={products} />
                    )}
                </div>
        </main>
    );
};

export default SearchProducts;