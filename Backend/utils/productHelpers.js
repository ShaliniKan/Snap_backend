const DEFAULT_SELLING_PRICE = 999;
const FALLBACK_IMAGE = "/banner1.jpg";
const { matchParentCategoryId } = require("./categoryHelpers");

const normalizeImagePath = (value = "") => {
  if (!value || !String(value).trim()) {
    return null;
  }

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

  return normalized;
};

const formatProductImages = (images = []) => {
  const formatted = (Array.isArray(images) ? images : [])
    .map(normalizeImagePath)
    .filter(Boolean);

  return formatted.length > 0 ? formatted : [FALLBACK_IMAGE];
};

const formatVariantRecord = (variant) => {
  const record = variant?.toObject ? variant.toObject() : { ...variant };
  const image = normalizeImagePath(record.image);

  return {
    ...record,
    image: image || null,
  };
};

const formatVariantList = (variants = []) =>
  (Array.isArray(variants) ? variants : []).map(formatVariantRecord);

const formatProductRecord = (product) => {
  const record = product?.toObject ? product.toObject() : { ...product };
  const images = formatProductImages(record.images);

  return {
    ...record,
    images,
    image: images[0],
  };
};

const resolveSellingPrice = (product = {}, variant = null) => {
  if (variant) {
    const variantPrice = variant.discount_price ?? variant.price;
    if (variantPrice > 0) {
      return variantPrice;
    }
  }

  const productPrice = product.discount_price ?? product.price;
  if (productPrice > 0) {
    return productPrice;
  }

  if (variant?.price > 0) {
    return variant.price;
  }

  if (product?.price > 0) {
    return product.price;
  }

  return DEFAULT_SELLING_PRICE;
};

const buildProductQuery = (query = {}, subcategoryIds = null) => {
  const filter = { status: { $ne: "inactive" } };

  if (subcategoryIds && subcategoryIds.length > 0) {
    filter.subcategory_id = { $in: subcategoryIds };
  } else if (query.subcategory) {
    filter.subcategory_id = query.subcategory;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { brand: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.brand) {
    filter.brand = { $regex: query.brand, $options: "i" };
  }

  if (query.rating) {
    filter.rating = { $gte: Number(query.rating) };
  }

  if (query.discount) {
    filter.discount = { $gte: Number(query.discount) };
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};

    if (query.minPrice) {
      filter.price.$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      filter.price.$lte = Number(query.maxPrice);
    }
  }

  if (query.inStock === "true") {
    filter.quantity = { $gt: 0 };
    filter.status = { $ne: "out_of_stock" };
  }

  if (query.inStock === "false") {
    filter.$or = [
      { quantity: { $lte: 0 } },
      { status: "out_of_stock" },
    ];
  }

  return filter;
};

const buildSort = (sort = "popularity") => {
  switch (sort) {
    case "newest":
      return { createdAt: -1 };
    case "price_low":
      return { price: 1 };
    case "price_high":
      return { price: -1 };
    case "discount":
      return { discount: -1 };
    case "rating":
      return { rating: -1 };
    case "popularity":
    default:
      return { createdAt: -1 };
  }
};

const resolveCategoryFilter = async (CategoriesModel, categoryId) => {
  if (!categoryId) {
    return null;
  }

  const subcategories = await CategoriesModel.find(matchParentCategoryId(categoryId)).select("_id");

  if (subcategories.length > 0) {
    return subcategories.map((entry) => entry._id);
  }

  return [categoryId];
};

module.exports = {
  buildProductQuery,
  buildSort,
  resolveCategoryFilter,
  resolveSellingPrice,
  normalizeImagePath,
  formatProductImages,
  formatProductRecord,
  formatVariantRecord,
  formatVariantList,
  DEFAULT_SELLING_PRICE,
  FALLBACK_IMAGE,
};
