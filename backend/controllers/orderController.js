const asyncHandler = require("../utils/asyncHandler");
const STATUS = require("../utils/constants");
const {addOrderService,showOrderService}=require('../services/orderService')

//add order
exports.addOrder = asyncHandler(async (req, res) => {
    console.log("Request received:", req.body);
    console.log("User ID:", req.user?._id);

    const userId = req.user._id;
    const { name, address, paymentMethod, total } = req.body;

    await addOrderService(name, address, paymentMethod, total, userId);

    res.status(200).json({ status: STATUS.SUCCESS, message: "order success" });
});



exports.showOrders=asyncHandler(async(req,res)=>{
    const userId=req.user._id
    const {orders}=await showOrderService(userId)
    const message=orders.length ?"orders retrived successfully":"no orders found"
    res.status(200).json({status:STATUS.SUCCESS,message,orders})
})                               