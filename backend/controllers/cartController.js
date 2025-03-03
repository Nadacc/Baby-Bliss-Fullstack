const asyncHandler = require('../utils/asyncHandler')
const STATUS = require('../utils/constants')
const {addToCartService,getCartServices,deleteCartServices,updateCartQuantityService} = require('../services/cartService')


exports.addToCart = asyncHandler(async(req,res) => {
    const {productId} = req.params
    const userId = req.user._id //authentication middleware
    await addToCartService(productId,userId)
    res.json({status:STATUS.SUCCESS,message:'add product successfully'})
})


exports.getCart=asyncHandler(async(req,res)=>{
    const userId=req.user._id
    const cart=await getCartServices(userId)
    if(cart.products.length===0){
        res.status(200).json({status:STATUS.SUCCESS,message:'your cart is empty'})
    }
    else{
        res.status(200).json({status:STATUS.SUCCESS,message:'cart list...',cart})
    }
})




exports.deleteCart=asyncHandler(async(req,res)=>{
    const {productId}=req.params
    const userId=req.user._id
    await deleteCartServices(productId,userId)
    res.json({status:STATUS.SUCCESS,message:'delete cart success'})
})




exports.updateCartQuantity = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { action } = req.body; // increment or decrement
    const userId = req.user._id;

    const updatedCart = await updateCartQuantityService(productId, userId, action);

    res.json({ status: STATUS.SUCCESS, message: "Cart updated successfully", cart: updatedCart });
});