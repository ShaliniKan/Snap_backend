import CategoryGrid from "../components/category/CategoryGrid";
import SectionState from "../components/common/SectionState";
import TopHeader from "../components/layout/TopHeader";
import Navbar from "../components/layout/Navbar";
import ProductGrid from "../components/product/ProductGrid";
import ProductGridSkeleton from "../components/product/ProductGridSkeleton";
import useCategories from "../hooks/useCategories";
import useProducts from "../hooks/useProducts";

const Home = () => {
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
    const { products, loading: productsLoading, error: productsError } = useProducts();

    const getCategoryPath = (category) => `/categories/${category._id}`;

    return (
        <div className="min-h-screen bg-slate-50">
            <TopHeader />
            <Navbar />

            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
                <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-red-500 to-orange-400 shadow-lg">
                    <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-100">Flash deals</p>
                            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Shop premium products at unbeatable prices.</h1>
                            <p className="mt-4 text-base text-red-50 sm:text-lg">Discover the latest arrivals across fashion, gadgets, beauty, and home essentials.</p>
                        </div>
                        <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                            <img src="/banner2.jpg" alt="Bestseller products" className="h-48 w-full rounded-2xl object-cover sm:w-80" />
                        </div>
                    </div>
                </section>

                <section>
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">Shop by category</p>
                            <h2 className="text-2xl font-semibold text-slate-900">Explore top categories</h2>
                        </div>
                        <a href="/products" className="text-sm font-semibold text-red-500">View all</a>
                    </div>

                    {categoriesLoading ? (
                        <SectionState>Loading categories...</SectionState>
                    ) : categoriesError ? (
                        <SectionState variant="error">{categoriesError}</SectionState>
                    ) : categories.length === 0 ? (
                        <SectionState>No categories available right now.</SectionState>
                    ) : (
                        <CategoryGrid categories={categories} getCategoryPath={getCategoryPath} />
                    )}
                </section>

                <section>
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">Featured products</p>
                            <h2 className="text-2xl font-semibold text-slate-900">Trending picks for you</h2>
                        </div>
                        <a href="/" className="text-sm font-semibold text-red-500">View all</a>
                    </div>

                    {productsLoading ? (
                        <ProductGridSkeleton />
                    ) : productsError ? (
                        <SectionState variant="error">{productsError}</SectionState>
                    ) : products.length === 0 ? (
                        <SectionState>No products available right now.</SectionState>
                    ) : (
                        <ProductGrid products={products} />
                    )}
                </section>
            </main>
        </div>
    );
};

export default Home;
