const Cart = require('../Modules/Cart');
const Product = require('../Modules/Product');
const Variant = require('../Modules/Product_Variant');

const calculateTotal = (items) => {

        return items.reduce((total, item) => {

        return total + (item.price * item.quantity);

        }, 0);

        };

const addToCart = async(req,res) =>{
    try{
        const {
            product_id,
            variant_id,
            quantity
        } = req.body

        if(quantity <= 0)
        {
            return res.status(500).json({
                success: false,
                message: "Product out of stock"
            });
        }
        const product = await Product.findById(product_id);
        if (!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        if(Variant.stock_quantity < quantity){
            return res.status(500).json({
                success: false,
                message: "No variant exist"
            })
        }

         let cart = await Cart.findOne({
            customer_id: req.user.id
        });

        if(!cart){
            cart = await Cart.create({
                customer_id: req.user.id,
                items:[]
            });
        }

        const existingItem = cart.items.find(item =>
            item.product_id.toString() === product_id &&(
                !variant_id || item.variant_id?.toString() === variant_id
            )
        );

        if (existingItem){
            existingItem.quantity += Number(quantity);
        } else {
            cart.items.push ({
                product_id, variant_id, quantity, price: Variant.price
            });
        }

    cart.total_amount = calculateTotal(cart.items);
    
    await cart.save();

    return res.status(200).json({
        success: true,
        data: cart
    });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCart = async(req,res) =>{
    try{
        const cart = await Cart.findOne({
            userId: req.user.id
        })
        .populate("items.product_id").populate("items.variant_id");

        if(!cart){
            return res.status(200).json({
                success: true,
                data: []
            });
        }
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateCartItem = async(req,res)=>{
    try{
        const{quantity} = req.body;
        const cart = await cart.findOne({
            userId: req.user.id
        });
        if(!cart){
            return res.status(404).json({
                success:false,
                message: "Cart not found"
            });
        }
        const item = cart.items.id(req.params.itemId);
        if(!item){
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }
        item.quantity = quantity;
        cart.total_amount = calculateTotal(cart.items);

        await cart.save();
        
        return res.status(200).json({
            success: true,
            data: cart
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const removeCartItem = async(req,res)=>{
    try{
        const cart = await Cart.findOne({
            userId: req.user.id
        });
        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(item =>
            item._id.toString() !== req.params.itemId
        );

        cart.total_amount = calculateTotal(cart.items);

        await cart.save();
        return res.status(200).json({
            success: true,
            message: "Item removed",
            data: cart
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const clearCart = async(req,res)=>{
    try{   
         const cart = await Cart.findOne({
            customer_id: req.user.id
         });
         if(!cart){
            return res.status(200).json({
                success: true,
                message: "Start shopping now"
            });
         }

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {addToCart, getCart, updateCartItem, removeCartItem, clearCart};
