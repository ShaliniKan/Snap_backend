const Customer = require("../Modules/Customer");
const User = require("../Modules/Users");

const PASSWORD_RULE_MESSAGE =
    "Password should have a minimum of 6 characters, at least 1 numeric and 1 alphabet";

const isValidPassword = (password = "") =>
    password.length >= 6 && /[0-9]/.test(password) && /[a-zA-Z]/.test(password);

const getOrCreateCustomer = async (userId) => {
    let customer = await Customer.findOne({ userId });

    if (!customer) {
        customer = await Customer.create({ userId, addresses: [] });
    }

    return customer;
};

const getProfile = async (req, res) => {
    try {
        const customer = await getOrCreateCustomer(req.user.id);

        return res.status(200).json({
            success: true,
            data: customer,
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
        const { dateOfBirth, gender } = req.body;
        const customer = await getOrCreateCustomer(req.user.id);

        if (dateOfBirth !== undefined) {
            customer.dateOfBirth = dateOfBirth || null;
        }

        if (gender !== undefined) {
            customer.gender = gender || undefined;
        }

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: customer,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const addAddress = async (req, res) => {
    try {
        const customer = await getOrCreateCustomer(req.user.id);
        const address = req.body;

        if (address.isDefault) {
            customer.addresses.forEach((entry) => {
                entry.isDefault = false;
            });
        }

        if (customer.addresses.length === 0) {
            address.isDefault = true;
        }

        customer.addresses.push(address);
        await customer.save();

        return res.status(201).json({
            success: true,
            message: "Address added successfully",
            data: customer,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateAddress = async (req, res) => {
    try {
        const customer = await getOrCreateCustomer(req.user.id);
        const address = customer.addresses.id(req.params.addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        Object.assign(address, req.body);

        if (req.body.isDefault) {
            customer.addresses.forEach((entry) => {
                entry.isDefault = entry._id.toString() === address._id.toString();
            });
        }

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: customer,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const customer = await getOrCreateCustomer(req.user.id);
        const address = customer.addresses.id(req.params.addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        const wasDefault = address.isDefault;
        address.deleteOne();

        if (wasDefault && customer.addresses.length > 0) {
            customer.addresses[0].isDefault = true;
        }

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Address removed successfully",
            data: customer,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const setDefaultAddress = async (req, res) => {
    try {
        const customer = await getOrCreateCustomer(req.user.id);
        const address = customer.addresses.id(req.params.addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        customer.addresses.forEach((entry) => {
            entry.isDefault = entry._id.toString() === address._id.toString();
        });

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Default address updated",
            data: customer,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!isValidPassword(newPassword)) {
            return res.status(400).json({
                success: false,
                message: PASSWORD_RULE_MESSAGE,
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
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
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    changePassword,
};
