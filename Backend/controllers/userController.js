const User = require("../Modules/Users");
const { resolveRegistrationRole, buildRegistrationProfile } = require("../utils/authHelpers");

const registerUser = async (req, res) => {
    try {
        const roleAssignment = resolveRegistrationRole(req.body);
        const userPayload = buildRegistrationProfile(req.body);

        const user = await User.create({
            ...userPayload,
            ...roleAssignment,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        const message = error?.message || "Registration failed";
        const statusCode = message.toLowerCase().includes("not allowed") || message.toLowerCase().includes("invalid") ? 400 : 500;

        res.status(statusCode).json({
            success: false,
            message,
        });
    }
};

module.exports = { registerUser };
