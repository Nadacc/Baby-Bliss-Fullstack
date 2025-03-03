const products = require('../models/productModel')
const CustomError = require('../utils/customError')

exports.productService = async({search,category,page=1,limit=10,isAdmin}) => {
    const query = isAdmin ? {} : { isDelete: false };
    if(category){
        query.category = {$regex : `^${category}$`,$options:'i'}
    }



    if(search){
        query.$or=[
            {name:{$regex:search,$options:'i'}},
            {category:{$regex:search,$options:'i'}}
        ]
    }
    
    
    const skip=(page-1)*limit
    const total=await products.countDocuments(query)
    const product=await products.find(query).skip(skip).limit(limit)


    return{
        product,
        pagination:{
            total,
            page,
            limit,
            totalPages:Math.ceil(total/limit)
    }
}
}

exports.singleProductService = async(id,isAdmin) => {
    const query = isAdmin ? { _id: id } : { _id: id, isDelete: false };
    const existingProduct = await products.findOne(query)
    if(!existingProduct){
        throw new CustomError('product is not available',400)
    }
    return existingProduct

}


exports.addProductService = async ({ name, price, quantity, description, category, url }) => {
    // const existingItem = await products.findOne({ name, isDelete: false });

    // if (existingItem) {
    //     throw new CustomError("Product already exists", 400);
    // }

    const newProduct = new products({ name, price, quantity, description, category, url });
    await newProduct.save();

    return newProduct;
};




exports.deleteProductService=async(productId)=>{
    const existingProduct=await products.findById(productId)
    if(!existingProduct){
        throw new CustomError('Product is unavailable',400)
    }
    return await products.findByIdAndUpdate(
        productId,{isDelete:true},{new:true}
    )

}



exports.updateProductService=async(_id,updateItems)=>{
    const existing=await products.findById(_id)
    if(!existing){
        throw new CustomError('product is unavailable',400)
    }
    const data=await products.findByIdAndUpdate({_id,isDelete:false},{ $set:{...updateItems}},{new:true})
    return data
}