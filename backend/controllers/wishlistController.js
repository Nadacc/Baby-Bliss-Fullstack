const asyncHandler = require('../utils/asyncHandler')
const {addToWishlistService,deleteWishlistService,getWishlistService} = require('../services/wishlistService')
const STATUS = require('../utils/constants')


exports.addToWishlist = asyncHandler(async(req,res) => {
    const userId = req.user._id ;
    const {productId} = req.params
    console.log("User ID:", req.user._id);
    console.log("Product ID:", productId);



    const favProduct = await addToWishlistService(userId,productId)
    res.status(200).json({
        status: STATUS.SUCCESS,
        message: 'Product added to wishlist successfully',
        wishlist: favProduct
    });
   
})


exports.deleteWishlist = asyncHandler(async(req,res) => {
    const userId = req.user._id ;
    const {productId} = req.params
    
    const updatedWishlist = await deleteWishlistService(userId, productId);
    res.status(200).json({
        status: STATUS.SUCCESS,
        message: 'Product removed from wishlist successfully.',
        wishlist: updatedWishlist // Returning the updated wishlist in the response
    });
})  



exports.getWishlist=asyncHandler(async(req,res)=>{
    const userId=req.user._id
    const wishlist=await getWishlistService(userId)
    if(wishlist.products.length===0){
        res.status(200).json({status:STATUS.SUCCESS,message:'your wishlist is empty'})
    }
    else{
        res.status(200).json({status:STATUS.SUCCESS,message:'wishlist...',wishlist})
    }
})


