const products = require('../models/productModel')
const CustomError = require('../utils/customError')

exports.productService = async ({ search, category, page = 1, limit = 9, isAdmin }) => {
    const query = isAdmin ? {} : { isDelete: false };

    if (category) {
        query.category = { $regex: `^${category}$`, $options: 'i' };
    }

    if (search ) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } }
        ];
    }

    
    const total = await products.countDocuments(query);

    const paginatedProducts = await products
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        product: paginatedProducts,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};



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

    try{
        const updatedProduct = await products.findOneAndUpdate(
            {_id},
            { $set: { isDelete:false,...updateItems  }},
            { new: true }
        );
    
        if(!updatedProduct){
            throw new CustomError('Product not found',404)
        }
    
        return updatedProduct;
    }
    catch(error){
        console.log('error in updating',error);
        
    }
    

}