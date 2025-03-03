const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    quantity:{type:Number,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true},
    url:{type:String,required:true},
    isDelete:{type:Boolean,required:true,default:false}
})

const products=mongoose.model('product',productSchema)

module.exports=products