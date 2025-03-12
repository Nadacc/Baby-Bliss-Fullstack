const express=require('express')
const { getallProducts,singleProduct} = require('../controllers/productController')

const router=express.Router()


router.get('/products',getallProducts)
router.get('/products/:id',singleProduct) 


module.exports=router