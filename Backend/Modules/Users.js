const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ["customer", "vendor"],
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps : true
});


module.exports = mongoose.model("User", userSchema);
