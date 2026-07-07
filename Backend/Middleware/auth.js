const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authuser || req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

        req.user = {
            ...decoded,
            id: decoded.id || decoded.userId,
        };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

module.exports = { authUser };
