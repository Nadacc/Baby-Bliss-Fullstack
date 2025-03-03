const express=require('express')
const authenticate = require('../middlewares/authMiddleware')
const { addToCart,getCart ,deleteCart,updateCartQuantity} = require('../controllers/cartController')

const router=express.Router()

router.post('/cart/:productId',authenticate,addToCart)
router.get('/getCart',authenticate,getCart)
router.delete('/deleteCart/:productId',authenticate,deleteCart)
router.put("/cart/:productId", authenticate, updateCartQuantity);
module.exports=router