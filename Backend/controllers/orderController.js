const Cart = require("../Modules/Cart");
const Order = require("../Modules/Order");
const Product = require("../Modules/Product");
const Variant = require("../Modules/Product_Variant");

const createOrder = async (req,res) => {
    try{
        const cart = await cart.findone({
            customer_id: req.user.id
        });
        if(!cart || cart.item.length===0){
            return res.status(400).json({
                success: false,
                message: "No order placed"
            });
        }
        for(const item of cart.item){
            if(item.variant_id){
                const variant = await Variant.findById(
                    item.variant_id
                );
                if(!variant){
                    return res.status(404).json({
                        success: false,
                        message: "No variant present"
                    });
                }
                if(variant.stock < item.quantity){
                    return res.status(400).json({
                        success: false,
                        message: "Insufficient stock"
                    });
                }
            }
        }
        const order = await Order.create({
            customer_id: req.user.id,
            items: cart.items,
            total_amount: cart.total_amount
        });
        
        for(const item of cart.items){
            if(item.variant_id){
                await Variant.findByIdAndUpdate(
                    item.variant_id,
                    {
                        $inc:{
                            stock: -item.quantity
                        }
                    }
                );
            }
        }
        cart.items = [];
        cart.total_amount = 0;
        await cart.save();
        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyOrders = async(req,res)=> {
    try{
        const orders = await Order.find({
            customer_id: req.user.id
        })
        .poplate("items.product_id")
        .poplate("items.variant_id")
        .sort({ createdAt: -1});
        return res.status(200).json({
            success: true,
            data: orders
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getOrderById = async(req,res) => {
    try{
        const order = await Order.findone({
            _id: req.params.orderId,
            customer_id: req.user.id
        })
        .populate("items.product_id")
        .poplate("item.variant_id");

        if(!order){
            return res.status(404).json({
                success:false,
                message: "Order not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: order
        });
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const cancelOrder = async(req,res) => {
    try{
        const order = await Order.findone({
            _id: req.params.orderId,
            customer_id: req.user.id
        });
        if(!order){
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        if(
            order.order_status === "shipped" ||
            order.order_status === "delivered"
        ) {
            return res.status(400).json({
                success: false,
                message: "Order cannot be cancelled"
            });
        }
        order.order_status = "cancelled";
        await order.save();

        for(const item of order.items){
            if(item.variant_id){
                await variant.findByIdAndUpdate(
                    item.variant_id,
                    {
                        $inc:{
                        stock: item.quantity
                        }
                    }
                );   
        }
    }
    return res.status(200).json({
        success: true,
        message: "Order cancelled"
    });
    } catch(error){
         return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};