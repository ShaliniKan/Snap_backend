const Review = require("../Modules/Review");
const Product = require("../Modules/Product");
const User = require("../Modules/Users");
const { getUserId } = require("../utils/vendorHelpers");

const refreshProductRating = async (productId) => {
    const stats = await Review.aggregate([
        { $match: { product_id: productId } },
        {
            $group: {
                _id: "$product_id",
                rating: { $avg: "$rating" },
                ratingCount: { $sum: 1 },
            },
        },
    ]);

    if (stats.length === 0) {
        await Product.findByIdAndUpdate(productId, { rating: 0, ratingCount: 0 });
        return;
    }

    await Product.findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].rating * 10) / 10,
        ratingCount: stats[0].ratingCount,
    });
};

const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product_id: req.params.productId })
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;
        const customerId = getUserId(req.user);

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const user = await User.findById(customerId);
        const customerName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Customer";

        const review = await Review.findOneAndUpdate(
            { product_id: productId, customer_id: customerId },
            {
                product_id: productId,
                customer_id: customerId,
                customer_name: customerName,
                rating,
                comment: comment || "",
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        await refreshProductRating(productId);

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            data: review,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getProductReviews,
    createReview,
};
