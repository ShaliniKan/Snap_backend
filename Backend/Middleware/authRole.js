
const authRole = (...permittedRoles) => {
    return(req,res,next) =>{
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Please log in to website" });
        }

        if(!req.user.role) {
            return res.status(401).json({ success: false, message: "Access denied"});
        }
        next();
    }
};

module.exports = {authRole};
