const Cart = require("../models/cartModel")
const products = require("../models/productModel")
const CustomError = require("../utils/customError")

//add to cart
exports.addToCartService=async(productId,userId)=>{
    //find product
    const existingProduct=await products.findById(productId)
    if(!existingProduct){
        throw new CustomError('product is not found',404)
    }


    if (existingProduct.isDelete) {
        throw new CustomError("Product unavailable", 400);
    }



    //create cart of user
    let cart=await Cart.findOne({user:userId})
    if(!cart){
        cart=new Cart({user:userId,products:[]})
    }

    const existingIndex=cart.products.findIndex((item)=>item.product.toString()===productId)
    if(existingIndex>-1){

        const currentQuantity=cart.products[existingIndex].quantity 
        if(currentQuantity+1>existingProduct.quantity){
            throw new CustomError('You cannot add the product to the quantity,stock is empty',400)
        }
        cart.products[existingIndex].quantity+=1
        //throw new CustomError('Product already exist in the cart',400) //quantity increased
    }
    else{
        cart.products.push({product:productId,quantity:1})
    }
    await cart.save()

}



exports.getCartServices=async(userId)=>{
    let cart=await Cart.findOne({user:userId}).populate('products.product')
    if (!cart) {
        cart = new Cart({ user: userId, products: [] });
        await cart.save();
    }
    return cart
}




exports.deleteCartServices=async(productId,userId)=>{
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new CustomError("Cart does not exist", 404);
    }
    const result = await Cart.updateOne(
        {user:userId},
        {$pull: {products:{product:productId}}}
    );
    // console.log('Update Result:', result);
    if(result.modifiedCount===0){
        throw new CustomError("Cart not found for the user or product not in cart.", 401)
    } 
}


exports.updateCartQuantityService = async (productId, userId, action) => {
    console.log("Update Request:", { productId, userId, action }); 
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new CustomError("Cart not found", 404);
    }

    const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);

    if (productIndex === -1) {
        throw new CustomError("Product not found in cart", 404);
    }

    const cartProduct = cart.products[productIndex];

    if (action === "increment") {
        const product = await products.findById(productId);
        if (cartProduct.quantity + 1 > product.quantity) {
            throw new CustomError("Stock limit reached", 400);
        }
        cart.products[productIndex].quantity += 1;
    } 
    else if (action === "decrement") {
        if (cartProduct.quantity > 1) {
            cart.products[productIndex].quantity -= 1;
        } else {
            cart.products.splice(productIndex, 1); // Remove product if quantity is 1
        }
    } else {
        throw new CustomError("Invalid action", 400);
    }

    await cart.save();
    return cart;
};