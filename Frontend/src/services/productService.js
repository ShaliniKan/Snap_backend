import api from "./api";

const getPrimaryVariant = (product) => {
    if (Array.isArray(product.variants) && product.variants.length > 0) {
        return product.variants[0];
    }

    if (Array.isArray(product.variant) && product.variant.length > 0) {
        return product.variant[0];
    }

    return product.variant || product.primaryVariant || {};
};

const calculateDiscount = (price, discountPrice) => {
    if (!price || !discountPrice || discountPrice >= price) {
        return 0;
    }

    return Math.round(((price - discountPrice) / price) * 100);
};

const resolveImageUrl = (value = "") => {
    if (!value) return "/banner1.jpg";
    if (value.startsWith("http") || value.startsWith("/")) return value;
    return `/${value.replace(/^\/+/, "")}`;
};

export const normalizeProduct = (product) => {
    const variant = getPrimaryVariant(product);
    const price = product.price || variant.price || 999;
    const sellingPrice = product.discount_price || product.discountPrice || variant.discount_price || variant.discountPrice || price;
    const rawImage = product.image || product.images?.[0] || product.thumbnail || product.productImage || "/banner1.jpg";

    return {
        ...product,
        primaryVariant: variant,
        variantId: product.variant_id || product.variantId || variant._id,
        image: resolveImageUrl(rawImage),
        images: product.images?.length ? product.images.map(resolveImageUrl) : [resolveImageUrl(rawImage)],
        price,
        sellingPrice,
        discount: product.discount || calculateDiscount(price, sellingPrice),
        rating: product.rating || product.averageRating || 4.1,
        ratingCount: product.ratingCount || product.reviewsCount || 0,
        variants: product.variants || product.variant || [],
    };
};

export const getProductById = async (productId) => {
    const response = await api.get(`/api/product/${productId}`);
    const product = response.data?.data || response.data;
    return normalizeProduct(product);
};

export const getProducts = async (queryString = "") => {
    const response = await api.get(`/api/product${queryString ? `?${queryString}` : ""}`);
    const payload = response.data && typeof response.data === "object" && !Array.isArray(response.data) ? response.data : { data: [] };
    const products = Array.isArray(payload.data) ? payload.data : [];

    return {
        products: products.map(normalizeProduct),
        pagination: payload.pagination || {},
    };
};
