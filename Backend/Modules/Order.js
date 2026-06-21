const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
{
    customer_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    items:[
        {
            product_id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },

            variant_id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Variant"
            },

            quantity:Number,

            price:Number
        }
    ],

    total_amount:{
        type:Number,
        required:true
    },

    payment_status:{
        type:String,
        enum:[
            "pending",
            "paid",
            "failed"
        ],
        default:"pending"
    },

    order_status:{
        type:String,
        enum:[
            "placed",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ],
        default:"placed"
    }
},
{
    timestamps:true
});

module.exports = mongoose.model(
    "Order",
    orderSchema
);