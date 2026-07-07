const Product = require("../Modules/Product");

const getUserId = (user = {}) => user.id || user.userId;

const assertProductOwnership = async (productId, vendorId) => {
    const product = await Product.findById(productId);

    if (!product) {
        return { ok: false, status: 404, message: "Product not found" };
    }

    if (product.vendor_id.toString() !== getUserId({ id: vendorId }).toString()) {
        return { ok: false, status: 403, message: "You are not allowed to modify this product" };
    }

    return { ok: true, product };
};

const getVendorProductIds = async (vendorId) => {
    const products = await Product.find({ vendor_id: getUserId({ id: vendorId }) }).select("_id");
    return products.map((product) => product._id);
};

module.exports = {
    getUserId,
    assertProductOwnership,
    getVendorProductIds,
};
