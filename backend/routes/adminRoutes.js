const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/isAdmin");
const authenticate = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const {allUsers,singleUsers, userBlock, totalRevenue} = require('../controllers/adminController')
const {addProducts, deleteProduct, updateProduct, getallProducts, singleProduct} = require('../controllers/productController')

router.get('/getusers',authenticate,isAdmin,allUsers)
router.get('/getusers/:id',authenticate,isAdmin,singleUsers)

router.get('/getproducts',authenticate,isAdmin,getallProducts)
router.get('/products/:id',authenticate,isAdmin,singleProduct)

router.post('/addproduct',authenticate,isAdmin,upload.single("url"),addProducts)
router.delete('/deleteproduct/:productId',authenticate,isAdmin,deleteProduct)
router.put('/updateproduct',authenticate,isAdmin,updateProduct)

router.patch('/blockUser/:id',authenticate,isAdmin,userBlock);
router.get('/totalRevenue',authenticate,isAdmin,totalRevenue)

module.exports = router





