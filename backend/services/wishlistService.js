const Wishlist = require('../models/wishlistModel')
const products = require('../models/productModel')
const CustomError = require('../utils/customError')


exports.addToWishlistService = async(userId,productId) => {
    //find product
    const existingProduct=await products.findById(productId)
    if(!existingProduct){
        console.log(`Product not found: ${productId}`);
        throw new CustomError('product not found',404)
    }

    
    let favourite=await Wishlist.findOne({user:userId})
    if(!favourite){
        favourite=new Wishlist({user:userId,products:[]})
    }

    const existingFav=favourite.products.some((item)=>item.toString()===productId)
    if (existingFav) {
        throw new CustomError ("Item already exists in favourites",400)
    }
    favourite.products.push(productId)
    await favourite.save()

    return favourite;

}




exports.deleteWishlistService = async (userId, productId) => {
    
    let favourite = await Wishlist.findOne({ user: userId });

    if (!favourite) {
        throw new CustomError("No favourites found for the user.", 404);
    }

    // Check if the product exists in the wishlist
    const productIndex = favourite.products.findIndex((item) => item.toString() === productId);

    if (productIndex === -1) {
        throw new CustomError("Product not found in user's favourites.", 404);
    }

    // Remove the product from the wishlist
    favourite.products.splice(productIndex, 1);
    await favourite.save();

    return favourite;
}


exports.getWishlistService = async(userId) => {
    let userFavourite = await Wishlist.findOne({ user: userId }).populate("products");
    if (!userFavourite) {
        userFavourite = new Wishlist({ user: userId, products: [] });
        await userFavourite.save();
    }
    return userFavourite
}

