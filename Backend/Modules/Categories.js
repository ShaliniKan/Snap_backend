const mongooose = require('mongoose');
const categorySchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    parentCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Categories", categorySchema);