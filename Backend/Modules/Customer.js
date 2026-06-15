const mongoose = require("mongoose");
const customerSchema = mongoose.Schema({
userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
},
dateOfBirth: {
    type: Date
},
gender: {
    type: String,
    enum: ["male","female","other"],
},
addresses: [{
    addressType: {
        type: String,
        enum: ["home", "work","other"],
        default: "home"
    },
    addressLine1: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    addressLine2: {
        type: String,
        trim: true,
        maxlength: 200
    },
    city: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    state: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    country: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    postalCode: {
            type: String,
            required: true,
            match: /^[1-9][0-9]{5}$/
        },

    phoneNumber: {
            type: String,
            match: /^[6-9][0-9]{9}$/
        },

    isDefault: {
            type: Boolean,
            default: false
        }
}]
},{
    timestamps: true
});



module.exports = mongoose.model("Customer", customerSchema);