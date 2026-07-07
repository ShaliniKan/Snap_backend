const requireApprovedVendor = (req, res, next) => {
    if (req.user?.role !== "vendor") {
        return res.status(403).json({
            success: false,
            message: "Vendor access required",
        });
    }

    if (req.user.approvalStatus !== "approved") {
        return res.status(403).json({
            success: false,
            message: "Your seller account is pending approval",
            code: "VENDOR_PENDING",
        });
    }

    return next();
};

module.exports = { requireApprovedVendor };
