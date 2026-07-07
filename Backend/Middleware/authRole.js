const authRole = (...permittedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Please log in to website" });
        }

        if (!req.user.role) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        if (permittedRoles.length && !permittedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "You do not have permission to access this resource" });
        }

        next();
    };
};

module.exports = { authRole };
