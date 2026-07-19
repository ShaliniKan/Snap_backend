import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionState from "../../components/common/SectionState";
import { deleteVendorProduct, getVendorProducts } from "../../services/vendorService";
import { ROUTES } from "../../routes/routePaths";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const VendorProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState("");

    const loadProducts = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getVendorProducts();
            setProducts(data);
        } catch (err) {
            setError(err.response?.data?.message || "Could not load your products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (!window.confirm("Delete this product?")) {
            return;
        }

        try {
            setDeletingId(productId);
            await deleteVendorProduct(productId);
            await loadProducts();
        } catch (err) {
            setError(err.response?.data?.message || "Could not delete product.");
        } finally {
            setDeletingId("");
        }
    };

    return (
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Catalogue</p>
                        <h2 className="mt-1 text-2xl font-semibold text-slate-900">My Products</h2>
                    </div>
                    <Link className="rounded-sm bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600" to={ROUTES.vendor.productNew}>
                        Add Product
                    </Link>
                </div>

                {loading ? (
                    <SectionState>Loading products...</SectionState>
                ) : error ? (
                    <SectionState variant="error">{error}</SectionState>
                ) : products.length === 0 ? (
                    <SectionState>No products yet. Add your first listing to start selling.</SectionState>
                ) : (
                    <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
                        <div className="grid grid-cols-[minmax(220px,1fr)_120px_100px_100px_140px] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <span>Product</span>
                            <span>Price</span>
                            <span>Stock</span>
                            <span>Status</span>
                            <span>Actions</span>
                        </div>
                        {products.map((product) => (
                            <div key={product._id} className="grid grid-cols-[minmax(220px,1fr)_120px_100px_100px_140px] items-center gap-3 border-b border-slate-100 px-4 py-4 text-sm last:border-b-0">
                                <div className="flex min-w-0 items-center gap-3">
                                    <img
                                        alt={product.name}
                                        className="h-14 w-14 rounded-sm border border-slate-200 object-cover"
                                        src={product.images?.[0] || "/banner1.jpg"}
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-slate-900">{product.name}</p>
                                        <p className="truncate text-xs text-slate-500">{product.brand || "ApnaMart"}</p>
                                    </div>
                                </div>
                                <span className="font-semibold text-slate-900">{formatCurrency(product.discount_price || product.price)}</span>
                                <span>{product.quantity}</span>
                                <span className="font-semibold capitalize text-emerald-600">{product.status}</span>
                                <div className="flex gap-2">
                                    <Link
                                        className="rounded-sm border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-red-200 hover:text-red-600"
                                        to={ROUTES.vendor.productEdit.replace(":productId", product._id)}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className="rounded-sm border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                        disabled={deletingId === product._id}
                                        onClick={() => handleDelete(product._id)}
                                        type="button"
                                    >
                                        {deletingId === product._id ? "..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
    );
};

export default VendorProducts;
