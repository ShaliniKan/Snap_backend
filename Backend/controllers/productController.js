const Product = require('../Modules/Product');

const Variant = require('../Modules/Product_Variant');

const Categories = require('../Modules/Categories');

const { buildProductQuery, buildSort, resolveCategoryFilter } = require('../utils/productHelpers');

const { getUserId, assertProductOwnership } = require('../utils/vendorHelpers');



const createProduct = async (req, res) => {

    try {

        const images = req.file ? [req.file.path.replace(/\\/g, "/")] : req.body.images || [];

        const product = await Product.create({

            ...req.body,

            vendor_id: getUserId(req.user),

            images,

        });



        res.status(201).json({

            success: true,

            message: "Product is created successfully",

            data: product,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};



const getAllProduct = async (req, res) => {

    try {

        const page = Math.max(1, Number(req.query.page) || 1);

        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

        const subcategoryIds = await resolveCategoryFilter(Categories, req.query.category);

        const filter = buildProductQuery(req.query, subcategoryIds);

        const sort = buildSort(req.query.sort);



        const total = await Product.countDocuments(filter);

        const product = await Product.find(filter)

            .sort(sort)

            .skip((page - 1) * limit)

            .limit(limit);



        res.status(200).json({

            success: true,

            data: product,

            pagination: {

                page,

                limit,

                total,

                pages: Math.ceil(total / limit),

            },

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};



const getVendorProducts = async (req, res) => {

    try {

        const vendorId = getUserId(req.user);

        const products = await Product.find({ vendor_id: vendorId }).sort({ createdAt: -1 });

        const productIds = products.map((product) => product._id);

        const variants = await Variant.find({ product_id: { $in: productIds } });

        const variantsByProduct = variants.reduce((map, variant) => {

            const key = variant.product_id.toString();

            if (!map[key]) {

                map[key] = [];

            }

            map[key].push(variant);

            return map;

        }, {});



        const data = products.map((product) => ({

            ...product.toObject(),

            variants: variantsByProduct[product._id.toString()] || [],

        }));



        res.status(200).json({

            success: true,

            data,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};



const getProductByID = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);



        if (!product) {

            return res.status(404).json({ success: false, message: "Product not found" });

        }



        const variants = await Variant.find({ product_id: product._id });



        res.status(200).json({

            success: true,

            data: {

                ...product.toObject(),

                variants,

            },

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};



const putProduct = async (req, res) => {

    try {

        const ownership = await assertProductOwnership(req.params.id, getUserId(req.user));



        if (!ownership.ok) {

            return res.status(ownership.status).json({

                success: false,

                message: ownership.message,

            });

        }



        const updatePayload = { ...req.body };

        if (req.file) {
            updatePayload.images = [req.file.path.replace(/\\/g, "/")];
        }

        const updateProduct = await Product.findByIdAndUpdate(req.params.id, updatePayload, { new: true });



        res.status(200).json({

            success: true,

            message: "Product updated successfully",

            data: updateProduct,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};



const deleteProduct = async (req, res) => {

    try {

        const ownership = await assertProductOwnership(req.params.id, getUserId(req.user));



        if (!ownership.ok) {

            return res.status(ownership.status).json({

                success: false,

                message: ownership.message,

            });

        }



        const productToDelete = ownership.product;

        const variants = await Variant.find({ product_id: productToDelete._id });



        if (variants.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Cannot delete product. Delete its variants first.",

            });

        }



        await Product.findByIdAndDelete(req.params.id);



        res.status(200).json({

            success: true,

            message: "Product deleted successfully",

            data: productToDelete,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};



module.exports = {

    createProduct,

    getAllProduct,

    getVendorProducts,

    getProductByID,

    putProduct,

    deleteProduct,

};

