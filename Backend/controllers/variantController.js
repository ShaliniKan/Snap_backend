const Variant = require("../Modules/Product_Variant");
const { assertProductOwnership, getUserId } = require("../utils/vendorHelpers");
const { formatVariantRecord, formatVariantList, normalizeImagePath } = require("../utils/productHelpers");

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

const parseVariantBody = (body = {}) => {
    const payload = {
        sku: body.sku,
        color: body.color || undefined,
        size: body.size || undefined,
        price: Number(body.price),
        stock_quantity: Number(body.stock_quantity),
    };

    if (body.discount_price !== undefined && body.discount_price !== "") {
        payload.discount_price = Number(body.discount_price);
    }

    return payload;
};

const buildVariantPayload = (req) => {
    const payload = parseVariantBody(req.body);

    if (req.file) {
        payload.image = normalizeImagePath(req.file.path.replace(/\\/g, "/"));
    }

    return payload;
};

const createVariants = async (req, res) => {
    try {
        const product = await ensureVendorOwnsProduct(req, res);
        if (!product) {
            return;
        }

        const variant = await Variant.create({
            ...buildVariantPayload(req),
            product_id: req.params.productId,
        });

        res.status(201).json({
            success: true,
            message: "Variant is created successfully",
            data: formatVariantRecord(variant),
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
            data: formatVariantList(variants),
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
            data: formatVariantRecord(variant),
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

        const updatePayload = parseVariantBody(req.body);

        if (req.file) {
            updatePayload.image = normalizeImagePath(req.file.path.replace(/\\/g, "/"));
        }

        const variant = await Variant.findOneAndUpdate(
            { _id: req.params.id, product_id: req.params.productId },
            updatePayload,
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
            data: formatVariantRecord(variant),
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
            data: formatVariantRecord(deletedVariant),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { createVariants, getVariants, getVariantsById, putVariants, deleteVariants };
