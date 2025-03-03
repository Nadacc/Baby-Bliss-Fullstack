const STATUS = require('../utils/constants')
const {productService,
    singleProductService,
    addProductService,
    deleteProductService,
    updateProductService} = require('../services/productService')
const asyncHandler = require('../utils/asyncHandler')
const CustomError = require('../utils/customError')
const cloudinary = require('../config/cloudinary')
const products = require('../models/productModel')

exports.getallProducts = asyncHandler(async(req,res) => {
    const {category,page,search} = req.query;
    const isAdmin = req.user && req.user.isAdmin;

    const {product,pagination} = await productService({
        category,
        page: parseInt(page, 10) || 1,
        limit: 10,
        search,
        isAdmin
    })

    if(product.length===0){
        res.status(200).json({
            status:STATUS.SUCCESS,
            message:"no products found"
        })
    }
    else{
            res.status(200).json({
            status:STATUS.SUCCESS,
            product,
            pagination
        })
    }
})


exports.singleProduct = asyncHandler(async(req,res) => {
    const{id} = req.params;
    const isAdmin = req.user && req.user.isAdmin;
    const product = await singleProductService(id,isAdmin)
    res.status(200).json({status:STATUS.SUCCESS,product})
})








exports.addProducts = asyncHandler(async (req, res) => {
    const { name, price, quantity, description, category } = req.body;

    if (!req.file) {
        throw new CustomError("Image is required", 400);
    }

    const imageUrl = req.file.path; // Cloudinary URL
    const existingItem = await products.findOne({ name, isDelete: false });
    if (existingItem) {
        try {
            
            const publicId = req.file.filename;
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted Cloudinary image: ${publicId}`);
        } catch (error) {
            console.error("Cloudinary deletion failed:", error);
        }

        throw new CustomError("Product already exists", 400);
    }

    const data = await addProductService({
        name,
        price,
        quantity,
        description,
        category,
        url: imageUrl, // Save Cloudinary URL
    });

    res.status(201).json({
        status: STATUS.SUCCESS,
        message: "Product added successfully",
        imageUrl,
        data,
    });
});







exports.deleteProduct=asyncHandler(async(req,res)=>{
    const {productId}=req.params
    const Products=await deleteProductService(productId)
    res.json({status:STATUS.SUCCESS,message:'Deleted Product Succesfully',Products})
})



exports.updateProduct=asyncHandler(async(req,res)=>{
    const {_id,...updateItems}=req.body
    if(!_id){
        throw new CustomError('Product is not found')
    }
    const updateProduct=await updateProductService(_id,updateItems)
    res.status(200).json({status:STATUS.SUCCESS,message:'Product updated successfully',updateProduct})
})