export const DEFAULT_APPAREL_SIZES = ["S", "M", "L", "XL", "2XL"];

export const DEFAULT_SHOE_SIZES = ["6", "7", "8", "9", "10", "11"];

export const isFootwearProduct = (product) => {
    const safeProduct = product ?? {};
    const searchable = [
        safeProduct.name,
        safeProduct.categoryName,
        safeProduct.subcategoryName,
        safeProduct.brand,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return /footwear|shoe|shoes|sandal|sneaker|boot|slipper|jutti/.test(searchable);
};

export const getDefaultSizes = (product) => {
    return isFootwearProduct(product) ? DEFAULT_SHOE_SIZES : DEFAULT_APPAREL_SIZES;
};

export const getAvailableSizes = (product, selectedColor = "") => {
    const safeProduct = product ?? {};
    const variants = safeProduct.variants || [];
    const filtered = selectedColor ? variants.filter((variant) => variant.color === selectedColor) : variants;
    const variantSizes = [...new Set(filtered.map((variant) => variant.size).filter(Boolean))];
    const defaultSizes = getDefaultSizes(safeProduct);

    return [...new Set([...variantSizes, ...defaultSizes])];
};

export const findCartVariant = (product, selectedColor = "", selectedSize = "") => {
    const variants = product?.variants || [];
    if (!variants.length) {
        return null;
    }

    if (selectedSize) {
        const exactMatch = variants.find(
            (variant) => variant.size === selectedSize && (!selectedColor || variant.color === selectedColor)
        );
        if (exactMatch) {
            return exactMatch;
        }
    }

    if (selectedColor) {
        return variants.find((variant) => variant.color === selectedColor) || null;
    }

    return variants[0] || null;
};

export const getProductDisplayColor = (product) => {
    const safeProduct = product ?? {};
    const variants = safeProduct.variants || [];
    if (!variants.length) {
        return "";
    }

    const colors = [...new Set(variants.map((variant) => variant.color).filter(Boolean))];
    if (colors.length === 1) {
        return colors[0];
    }

    if (colors.length > 1) {
        return `${colors.length} Colors`;
    }

    return safeProduct.primaryVariant?.color || "";
};

export const hasProductVariants = (product) => {
    const variants = product?.variants;
    return Array.isArray(variants) && variants.length > 0;
};
