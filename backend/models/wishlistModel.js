
const mongoose=require('mongoose')

const WishlistSchema = mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    products:[
        {
            
                type:mongoose.Schema.Types.ObjectId,
                ref:'product',
                required:true
            
           
        }
    ]
})

const Wishlist = mongoose.model("wishlist",WishlistSchema)
module.exports = Wishlist