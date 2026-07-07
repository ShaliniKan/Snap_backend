const DEFAULT_SELLING_PRICE = 999;

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

const resolveCategoryFilter = async (Categories, categoryId) => {
  if (!categoryId) {
    return null;
  }

  const subcategories = await Categories.find({ parentCategoryId: categoryId }).select("_id");

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
  DEFAULT_SELLING_PRICE,
};
