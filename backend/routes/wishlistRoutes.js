const express=require('express')
const authenticate = require('../middlewares/authMiddleware')
const { addToWishlist,deleteWishlist,getWishlist} = require('../controllers/wishlistController')

const router=express.Router()

router.post('/addWishlist/:productId',authenticate,addToWishlist)
router.get('/getWishlist',authenticate,getWishlist)
router.delete('/deleteWishlist/:productId',authenticate,deleteWishlist)
module.exports=router