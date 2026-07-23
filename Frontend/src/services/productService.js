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

export const resolveImageUrl = (value = "") => {
    if (!value || !String(value).trim()) return "/banner1.jpg";

    let normalized = String(value).trim().replace(/\\/g, "/");

    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
        return normalized;
    }

    if (normalized.startsWith("upload/")) {
        normalized = `uploads/${normalized.slice("upload/".length)}`;
    }

    if (!normalized.startsWith("/")) {
        normalized = `/${normalized}`;
    }

    return encodeUriPath(normalized);
};

const encodeUriPath = (normalized) => {
    if (!normalized || normalized.startsWith("http://") || normalized.startsWith("https://")) {
        return normalized;
    }

    const [pathname, ...queryParts] = normalized.split("?");
    const encodedPath = pathname
        .split("/")
        .map((segment) => {
            if (!segment) {
                return segment;
            }

            try {
                return encodeURIComponent(decodeURIComponent(segment));
            } catch (error) {
                return encodeURIComponent(segment);
            }
        })
        .join("/");

    return queryParts.length > 0 ? `${encodedPath}?${queryParts.join("?")}` : encodedPath;
};

export const getProductPrimaryImage = (product) => {
    const productLevelImage =
        product?.images?.[0] || product?.image || product?.thumbnail || product?.productImage;

    if (productLevelImage) {
        return resolveImageUrl(productLevelImage);
    }

    const variant = getPrimaryVariant(product);
    return variant?.image ? resolveImageUrl(variant.image) : "/banner1.jpg";
};

export const normalizeProduct = (product) => {
    const normalizedVariants = (product.variants || product.variant || []).map((entry) => ({
        ...entry,
        image: entry.image ? resolveImageUrl(entry.image) : null,
    }));
    const variant = getPrimaryVariant({ ...product, variants: normalizedVariants });
    const primaryImage = getProductPrimaryImage({ ...product, variants: normalizedVariants });
    const price = product.price || variant.price || 999;
    const sellingPrice = product.discount_price || product.discountPrice || variant.discount_price || variant.discountPrice || price;
    const normalizedImages = [...new Set(
        (product.images || [])
            .map(resolveImageUrl)
            .filter(Boolean)
    )];

    return {
        ...product,
        primaryVariant: variant,
        variantId: product.variant_id || product.variantId || variant._id,
        image: primaryImage,
        images: normalizedImages.length > 0 ? normalizedImages : [primaryImage],
        price,
        sellingPrice,
        discount: product.discount || calculateDiscount(price, sellingPrice),
        rating: product.rating || product.averageRating || 4.1,
        ratingCount: product.ratingCount || product.reviewsCount || 0,
        variants: normalizedVariants,
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
