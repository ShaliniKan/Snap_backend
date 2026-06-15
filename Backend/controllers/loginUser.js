const User = require("../Modules/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async(req, res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
           return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password, user.password
        );

        if (!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid password. Please try again"
            });
        }
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );
        
        res.status(200).json({success: true,token});

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {loginUser};