const User = require("../Modules/Users");
const Vendor = require("../Modules/Vendor");
const Product = require("../Modules/Product");
const Order = require("../Modules/Order");
const { getUserId, getVendorProductIds } = require("../utils/vendorHelpers");
const { sendVendorStatusEmail } = require("../utils/emailService");

const syncVendorApproval = async (userId, status) => {
    const isApproved = status === "approved";

    await User.findByIdAndUpdate(userId, { approvalStatus: status });
    await Vendor.findOneAndUpdate({ userId }, { isApproved }, { new: true });
};

const getProfile = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: getUserId(req.user) });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor profile not found. Complete seller onboarding first.",
                code: "VENDOR_PROFILE_MISSING",
            });
        }

        return res.status(200).json({
            success: true,
            data: vendor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const createProfile = async (req, res) => {
    try {
        const userId = getUserId(req.user);
        const existing = await Vendor.findOne({ userId });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Vendor profile already exists",
            });
        }

        const { businessName, businessAddress, contactNumber } = req.body;

        const vendor = await Vendor.create({
            userId,
            businessName,
            businessAddress,
            contactNumber,
            isApproved: false,
        });

        await User.findByIdAndUpdate(userId, { approvalStatus: "pending" });

        return res.status(201).json({
            success: true,
            message: "Seller profile submitted for approval",
            data: vendor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: getUserId(req.user) });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor profile not found",
            });
        }

        const { businessName, businessAddress, contactNumber } = req.body;

        if (businessName !== undefined) vendor.businessName = businessName;
        if (businessAddress !== undefined) vendor.businessAddress = businessAddress;
        if (contactNumber !== undefined) vendor.contactNumber = contactNumber;

        await vendor.save();

        return res.status(200).json({
            success: true,
            message: "Seller profile updated",
            data: vendor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const vendorId = getUserId(req.user);
        const productIds = await getVendorProductIds(vendorId);
        const productCount = productIds.length;

        const orders = await Order.find({ "items.product_id": { $in: productIds } })
            .select("items total_amount order_status createdAt")
            .lean();

        let orderCount = 0;
        let revenue = 0;
        let pendingOrders = 0;

        orders.forEach((order) => {
            const vendorItems = order.items.filter((item) =>
                productIds.some((productId) => productId.toString() === item.product_id.toString())
            );

            if (vendorItems.length === 0) {
                return;
            }

            orderCount += 1;
            revenue += vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            if (["placed", "processing"].includes(order.order_status)) {
                pendingOrders += 1;
            }
        });

        const activeProducts = await Product.countDocuments({
            vendor_id: vendorId,
            status: "active",
        });

        return res.status(200).json({
            success: true,
            data: {
                productCount,
                activeProducts,
                orderCount,
                pendingOrders,
                revenue,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const listPendingVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({ isApproved: false })
            .populate("userId", "firstName lastName email approvalStatus role")
            .sort({ createdAt: -1 });

        const data = vendors.filter((vendor) => vendor.userId?.approvalStatus === "pending");

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const approveVendor = async (req, res) => {
    try {
        const { vendorUserId } = req.params;
        const vendor = await Vendor.findOne({ userId: vendorUserId });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        await syncVendorApproval(vendorUserId, "approved");

        const updatedVendor = await Vendor.findOne({ userId: vendorUserId }).populate(
            "userId",
            "firstName lastName email approvalStatus"
        );

        return res.status(200).json({
            success: true,
            message: "Vendor approved successfully",
            data: updatedVendor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const rejectVendor = async (req, res) => {
    try {
        const { vendorUserId } = req.params;
        const vendor = await Vendor.findOne({ userId: vendorUserId });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        await syncVendorApproval(vendorUserId, "rejected");

        const updatedVendor = await Vendor.findOne({ userId: vendorUserId }).populate(
            "userId",
            "firstName lastName email approvalStatus"
        );

        return res.status(200).json({
            success: true,
            message: "Vendor rejected",
            data: updatedVendor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getProfile,
    createProfile,
    updateProfile,
    getDashboardStats,
    listPendingVendors,
    approveVendor,
    rejectVendor,
};
