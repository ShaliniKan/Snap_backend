const Variant = require('../Modules/Product_Variant');
const { assertProductOwnership, getUserId } = require('../utils/vendorHelpers');

const ensureVendorOwnsProduct = async (req, res) => {
    const ownership = await assertProductOwnership(req.params.productId, getUserId(req.user));

    if (!ownership.ok) {
        res.status(ownership.status).json({
            success: false,
            message: ownership.message,
        });
        return null;
    }

    return ownership.product;
};

const createVariants = async (req, res) => {
    try {
        const product = await ensureVendorOwnsProduct(req, res);
        if (!product) {
            return;
        }

        const variant = await Variant.create({ ...req.body, product_id: req.params.productId });
        res.status(201).json({
            success: true,
            message: "Variant is created successfully",
            data: variant,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getVariants = async (req, res) => {
    try {
        const variants = await Variant.find({ product_id: req.params.productId });
        res.status(200).json({
            success: true,
            data: variants,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getVariantsById = async (req, res) => {
    try {
        const variant = await Variant.findById(req.params.id);

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found",
            });
        }

        res.status(200).json({
            success: true,
            data: variant,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const putVariants = async (req, res) => {
    try {
        const product = await ensureVendorOwnsProduct(req, res);
        if (!product) {
            return;
        }

        const variant = await Variant.findOneAndUpdate(
            { _id: req.params.id, product_id: req.params.productId },
            req.body,
            { new: true }
        );

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found",
            });
        }

        res.status(200).json({
            success: true,
            data: variant,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteVariants = async (req, res) => {
    try {
        const product = await ensureVendorOwnsProduct(req, res);
        if (!product) {
            return;
        }

        const deletedVariant = await Variant.findOneAndDelete({
            _id: req.params.id,
            product_id: req.params.productId,
        });

        if (!deletedVariant) {
            return res.status(404).json({ success: false, message: "Product variant not found" });
        }

        res.status(200).json({
            success: true,
            message: "Variant deleted successfully",
            data: deletedVariant,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { createVariants, getVariants, getVariantsById, putVariants, deleteVariants };
