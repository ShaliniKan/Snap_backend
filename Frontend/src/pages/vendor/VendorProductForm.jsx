import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SectionState from "../../components/common/SectionState";
import { getCategories, getSubcategories } from "../../services/categoryService";
import { deleteProductVariant, getVendorProducts } from "../../services/vendorService";
import { createVendorProductWithImage, updateVendorProductWithImage, createVariantWithImage } from "../../services/productUploadService";
import { resolveImageUrl } from "../../services/productService";
import { getDefaultSizes } from "../../utils/productSizes";
import { ROUTES } from "../../routes/routePaths";

const resolvePreviewUrl = (value = "") => {
    if (!value) return "";
    if (value.startsWith("blob:") || value.startsWith("http")) return value;
    return resolveImageUrl(value);
};

const emptyProduct = {
    name: "",
    brand: "",
    description: "",
    subcategory_id: "",
    price: "",
    discount_price: "",
    quantity: "",
    status: "active",
};

const emptyVariant = {
    sku: "",
    color: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
};

const VendorProductForm = () => {
    const { productId } = useParams();
    const isEditing = Boolean(productId);
    const navigate = useNavigate();
    const [form, setForm] = useState(emptyProduct);
    const [variantForm, setVariantForm] = useState(emptyVariant);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [variants, setVariants] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [variantImageFile, setVariantImageFile] = useState(null);
    const [variantImagePreview, setVariantImagePreview] = useState("");

    useEffect(() => {
        const loadFormData = async () => {
            setLoading(true);
            setError("");

            try {
                const categories = await getCategories();
                const subcategoryLists = await Promise.all(
                    categories.map((category) => getSubcategories(category._id))
                );
                const flatSubcategories = subcategoryLists.flat();
                setSubcategories(flatSubcategories);

                if (isEditing) {
                    const products = await getVendorProducts();
                    const product = products.find((entry) => entry._id === productId);

                    if (!product) {
                        throw new Error("Product not found");
                    }

                    setForm({
                        name: product.name || "",
                        brand: product.brand || "",
                        description: product.description || "",
                        subcategory_id: product.subcategory_id?._id || product.subcategory_id || "",
                        price: product.price ?? "",
                        discount_price: product.discount_price ?? "",
                        quantity: product.quantity ?? "",
                        status: product.status || "active",
                    });
                    setVariants(product.variants || []);
                    setImagePreview(product.images?.[0] || "");
                    setGalleryPreviews((product.images || []).slice(1));
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Could not load product form.");
            } finally {
                setLoading(false);
            }
        };

        loadFormData();
    }, [isEditing, productId]);

    const payload = useMemo(
        () => ({
            ...form,
            price: Number(form.price),
            discount_price: form.discount_price ? Number(form.discount_price) : undefined,
            quantity: Number(form.quantity),
        }),
        [form]
    );

    const sizeOptions = useMemo(() => {
        const subcategory = subcategories.find((entry) => entry._id === form.subcategory_id);

        return getDefaultSizes({
            name: form.name,
            subcategoryName: subcategory?.itemName,
        });
    }, [form.name, form.subcategory_id, subcategories]);

    const toggleSize = (size) => {
        setSelectedSizes((current) =>
            current.includes(size) ? current.filter((entry) => entry !== size) : [...current, size]
        );
    };

    const handleSaveProduct = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccessMessage("");

            if (isEditing) {
                const updated = await updateVendorProductWithImage(productId, payload, imageFile, galleryFiles);
                const updatedImages = updated?.images || [];
                setImagePreview(updatedImages[0] || "");
                setGalleryPreviews(updatedImages.slice(1));
                setImageFile(null);
                setGalleryFiles([]);
                setSuccessMessage("Product updated successfully.");
            } else {
                const created = await createVendorProductWithImage(payload, imageFile, galleryFiles);
                setSuccessMessage("Product created successfully.");
                navigate(ROUTES.vendor.productEdit.replace(":productId", created._id), { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || "Could not save product.");
        } finally {
            setSaving(false);
        }
    };

    const handleAddVariant = async (event) => {
        event.preventDefault();

        if (!isEditing) {
            setError("Save the product first before adding variants.");
            return;
        }

        if (selectedSizes.length === 0) {
            setError("Select at least one size.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const createdVariants = [];

            for (const size of selectedSizes) {
                const created = await createVariantWithImage(
                    productId,
                    {
                        ...variantForm,
                        sku: selectedSizes.length > 1 ? `${variantForm.sku}-${size}` : variantForm.sku,
                        size,
                        price: Number(variantForm.price),
                        discount_price: variantForm.discount_price ? Number(variantForm.discount_price) : undefined,
                        stock_quantity: Number(variantForm.stock_quantity),
                    },
                    variantImageFile
                );
                createdVariants.push(created);
            }

            setVariants((current) => [...current, ...createdVariants]);
            setVariantForm(emptyVariant);
            setSelectedSizes([]);
            setVariantImageFile(null);
            setVariantImagePreview("");
            setSuccessMessage(
                createdVariants.length > 1
                    ? `${createdVariants.length} size variants added.`
                    : "Variant added."
            );
        } catch (err) {
            setError(err.response?.data?.message || "Could not add variant.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteVariant = async (variantId) => {
        try {
            await deleteProductVariant(productId, variantId);
            setVariants((current) => current.filter((variant) => variant._id !== variantId));
        } catch (err) {
            setError(err.response?.data?.message || "Could not delete variant.");
        }
    };

    if (loading) {
        return <SectionState>Loading product form...</SectionState>;
    }

    return (
            <div className="space-y-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Catalogue</p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900">{isEditing ? "Edit Product" : "Add Product"}</h2>
                </div>

                {error && <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
                {successMessage && <div className="rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div>}

                <form className="space-y-4 rounded-sm border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSaveProduct}>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="block text-sm">
                            <span className="font-semibold text-slate-700">Product name</span>
                            <input className="mt-1 h-10 w-full rounded-sm border border-slate-200 px-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </label>
                        <label className="block text-sm">
                            <span className="font-semibold text-slate-700">Brand</span>
                            <input className="mt-1 h-10 w-full rounded-sm border border-slate-200 px-3" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                        </label>
                        <label className="block text-sm md:col-span-2">
                            <span className="font-semibold text-slate-700">Description</span>
                            <textarea className="mt-1 min-h-24 w-full rounded-sm border border-slate-200 px-3 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </label>
                        <label className="block text-sm">
                            <span className="font-semibold text-slate-700">Subcategory</span>
                            <select className="mt-1 h-10 w-full rounded-sm border border-slate-200 px-3" value={form.subcategory_id} onChange={(e) => setForm({ ...form, subcategory_id: e.target.value })} required>
                                <option value="">Select subcategory</option>
                                {subcategories.map((subcategory) => (
                                    <option key={subcategory._id} value={subcategory._id}>{subcategory.itemName}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block text-sm">
                            <span className="font-semibold text-slate-700">Status</span>
                            <select className="mt-1 h-10 w-full rounded-sm border border-slate-200 px-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="out_of_stock">Out of stock</option>
                            </select>
                        </label>
                        <label className="block text-sm">
                            <span className="font-semibold text-slate-700">Price (₹)</span>
                            <input className="mt-1 h-10 w-full rounded-sm border border-slate-200 px-3" type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                        </label>
                        <label className="block text-sm">
                            <span className="font-semibold text-slate-700">Discount price (₹)</span>
                            <input className="mt-1 h-10 w-full rounded-sm border border-slate-200 px-3" type="number" min="0" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} />
                        </label>
                        <label className="block text-sm md:col-span-2">
                            <span className="font-semibold text-slate-700">Main product image</span>
                            <input
                                accept="image/*"
                                className="mt-1 block w-full text-sm"
                                type="file"
                                onChange={(event) => {
                                    const file = event.target.files?.[0] || null;
                                    setImageFile(file);
                                    setImagePreview(file ? URL.createObjectURL(file) : imagePreview);
                                }}
                            />
                            {imagePreview && (
                                <img alt="Preview" className="mt-3 h-32 w-32 rounded-sm border border-slate-200 object-cover" src={resolvePreviewUrl(imagePreview)} />
                            )}
                        </label>
                        <label className="block text-sm md:col-span-2">
                            <span className="font-semibold text-slate-700">Additional gallery images</span>
                            <input
                                accept="image/*"
                                className="mt-1 block w-full text-sm"
                                multiple
                                type="file"
                                onChange={(event) => {
                                    const files = Array.from(event.target.files || []);
                                    setGalleryFiles(files);
                                    setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
                                }}
                            />
                            {(galleryPreviews.length > 0) && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {galleryPreviews.map((preview, index) => (
                                        <img key={`${preview}-${index}`} alt={`Gallery ${index + 1}`} className="h-20 w-20 rounded-sm border border-slate-200 object-cover" src={preview.startsWith("blob:") || preview.startsWith("http") ? preview : resolvePreviewUrl(preview)} />
                                    ))}
                                </div>
                            )}
                        </label>
                        <label className="block text-sm">
                            <span className="font-semibold text-slate-700">Stock quantity</span>
                            <input className="mt-1 h-10 w-full rounded-sm border border-slate-200 px-3" type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <button className="rounded-sm bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60" disabled={saving} type="submit">
                            {saving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
                        </button>
                        <Link className="rounded-sm border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-red-200 hover:text-red-600" to={ROUTES.vendor.products}>
                            Back to products
                        </Link>
                    </div>
                </form>

                {isEditing && (
                    <div className="space-y-4 rounded-sm border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900">Variants</h3>

                        {variants.length > 0 && (
                            <div className="space-y-2">
                                {variants.map((variant) => (
                                    <div key={variant._id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-slate-100 px-3 py-2 text-sm">
                                        <div className="flex items-center gap-3">
                                            {variant.image && (
                                                <img
                                                    alt={`${variant.color || variant.sku} variant`}
                                                    className="h-12 w-12 rounded-sm border border-slate-200 object-cover"
                                                    src={resolvePreviewUrl(variant.image)}
                                                />
                                            )}
                                            <span>{variant.sku} · {variant.color || "Standard"} · {variant.size || "Free"} · ₹{variant.discount_price || variant.price} · Stock {variant.stock_quantity}</span>
                                        </div>
                                        <button className="text-xs font-semibold text-red-600" onClick={() => handleDeleteVariant(variant._id)} type="button">Remove</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form className="grid gap-3 md:grid-cols-3" onSubmit={handleAddVariant}>
                            <input className="h-10 rounded-sm border border-slate-200 px-3 text-sm" placeholder="SKU" value={variantForm.sku} onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })} required />
                            <input className="h-10 rounded-sm border border-slate-200 px-3 text-sm" placeholder="Color" value={variantForm.color} onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })} />
                            <div className="md:col-span-3">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">Sizes</span>
                                <div className="flex flex-wrap gap-2">
                                    {sizeOptions.map((size) => {
                                        const isSelected = selectedSizes.includes(size);

                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => toggleSize(size)}
                                                className={`min-w-[48px] rounded-sm border px-3 py-2 text-sm font-semibold transition ${
                                                    isSelected
                                                        ? "border-red-500 bg-red-50 text-red-600"
                                                        : "border-slate-200 text-slate-700 hover:border-red-200 hover:text-red-600"
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                                {selectedSizes.length > 0 && (
                                    <p className="mt-2 text-xs text-slate-500">
                                        Selected: {selectedSizes.join(", ")}
                                    </p>
                                )}
                            </div>
                            <input className="h-10 rounded-sm border border-slate-200 px-3 text-sm" placeholder="Price" type="number" value={variantForm.price} onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })} required />
                            <input className="h-10 rounded-sm border border-slate-200 px-3 text-sm" placeholder="Discount price" type="number" value={variantForm.discount_price} onChange={(e) => setVariantForm({ ...variantForm, discount_price: e.target.value })} />
                            <input className="h-10 rounded-sm border border-slate-200 px-3 text-sm" placeholder="Stock" type="number" value={variantForm.stock_quantity} onChange={(e) => setVariantForm({ ...variantForm, stock_quantity: e.target.value })} required />
                            <label className="block text-sm md:col-span-3">
                                <span className="font-semibold text-slate-700">Variant image</span>
                                <input
                                    accept="image/*"
                                    className="mt-1 block w-full text-sm"
                                    type="file"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0] || null;
                                        setVariantImageFile(file);
                                        setVariantImagePreview(file ? URL.createObjectURL(file) : "");
                                    }}
                                />
                                {variantImagePreview && (
                                    <img alt="Variant preview" className="mt-3 h-24 w-24 rounded-sm border border-slate-200 object-cover" src={variantImagePreview} />
                                )}
                            </label>
                            <button className="rounded-sm bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 md:col-span-3 md:w-fit" disabled={saving} type="submit">
                                {saving ? "Adding..." : selectedSizes.length > 1 ? `Add ${selectedSizes.length} Variants` : "Add Variant"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
    );
};

export default VendorProductForm;
