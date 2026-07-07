const Cart = require('../Modules/Cart');
const Product = require('../Modules/Product');
const Variant = require('../Modules/Product_Variant');
const { resolveSellingPrice } = require('../utils/productHelpers');

const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const syncCartItemPrices = (cart) => {
    let changed = false;

    cart.items.forEach((item) => {
        const product = item.product_id;
        const variant = item.variant_id;
        const resolvedPrice = resolveSellingPrice(product || {}, variant || null);

        if ((!item.price || item.price <= 0) && item.price !== resolvedPrice) {
            item.price = resolvedPrice;
            changed = true;
        }
    });

    if (changed) {
        cart.total_amount = calculateTotal(cart.items);
    }

    return changed;
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
        
        const variant = variant_id ? await Variant.findById(variant_id) : null;
        if(variant_id && !variant){
            return res.status(404).json({
                success: false,
                message: "Variant not found"
            });
        }

        if (variant && variant.stock_quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: "Product out of stock"
            });
        }

        if (!variant && product.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: "Product out of stock"
            });
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

        const itemPrice = resolveSellingPrice(product, variant);

        if (existingItem){
            existingItem.quantity += Number(quantity);
            if (!existingItem.price || existingItem.price <= 0) {
                existingItem.price = itemPrice;
            }
        } else {
            cart.items.push ({
                product_id,
                variant_id,
                quantity,
                price: itemPrice
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
            customer_id: req.user.id
        })
        .populate("items.product_id").populate("items.variant_id");

        if(!cart){
            return res.status(200).json({
                success: true,
                data: {
                    items: [],
                    total_amount: 0
                }
            });
        }

        if (syncCartItemPrices(cart)) {
            await cart.save();
        }

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

const updateCartItem = async(req,res)=>{
    try{
        const{quantity} = req.body;
        const cart = await Cart.findOne({
            customer_id: req.user.id
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
        if(quantity <= 0){
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than zero"
            });
        }

        if (item.variant_id) {
            const variant = await Variant.findById(item.variant_id);
            if (!variant || variant.stock_quantity < quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Product out of stock"
                });
            }
        } else {
            const product = await Product.findById(item.product_id);
            if (!product || product.quantity < quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Product out of stock"
                });
            }
        }

        item.quantity = quantity;
        cart.total_amount = calculateTotal(cart.items);

        await cart.save();
        await cart.populate("items.product_id");
        await cart.populate("items.variant_id");
        
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
            customer_id: req.user.id
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
        await cart.populate("items.product_id");
        await cart.populate("items.variant_id");
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
                message: "Start shopping now",
                data: {
                    items: [],
                    total_amount: 0
                }
            });
         }

         cart.items = [];
         cart.total_amount = 0;
         await cart.save();

         return res.status(200).json({
            success: true,
            message: "Cart cleared",
            data: cart
         });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {addToCart, getCart, updateCartItem, removeCartItem, clearCart};
