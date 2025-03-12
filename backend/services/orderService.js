const Order = require('../models/orderModel')
const products = require('../models/productModel')
const Cart = require('../models/cartModel')
const CustomError = require('../utils/customError')
const razorpayInstance = require('../config/razorpay')





exports.addOrderService=async(name,address,paymentMethod,total,userId)=>{
    const cart=await Cart.findOne({user:userId})
    if(!cart ||cart.products.length === 0){
        throw new CustomError('Your cart is empty. Add items before placing an order.')
    }
    const order = new Order({
        user: userId,
        items: [],
        date: new Date(),
        name,             
        address,          
        paymentMethod,    
        total,
        razorpayPaymentStatus:"pending"             
    });
    for (let item of cart.products) {
        const product = await products.findById(item.product);
        if (!product) {
          throw new CustomError(`Product with ID "${item.product}" does not exist.`);
        }
    
        if (product.quantity < item.quantity) {
          throw new CustomError(I`nsufficient quantity for ${product.name}.`);
        }
        product.quantity -= item.quantity;
        await product.save();
        order.items.push({ productId: item.product, quantity: item.quantity });
      }
      await order.save();
      cart.products = [];
      await cart.save();


      let razorpayOrderId = null;
      let amount = total*100;

      if (paymentMethod === "razorpay") {
        const options = {
          amount: amount,
          currency: "INR",
          receipt: `order_receipt_${order._id}`,
          payment_capture: 1,
        };
    
        //create order with rayzorpay
        try {
          const razorpayOrder = await razorpayInstance.orders.create(options);
          console.log("✅ Razorpay Order Created:", razorpayOrder);

          console.log("🛠 Razorpay Order ID Created:", order.razorpayOrderId);

          order.razorpayOrderId = razorpayOrder.id;
          await order.save();

          console.log("✅ Order Saved with Razorpay ID:", order.razorpayOrderId);
          //razorpayOrderId = razorpayOrder.id;
          //amount = razorpayOrder.amount;

        } catch (error) {
          console.error("❌ Razorpay order creation failed:", error);
          throw new CustomError("Rayzorpay order creation failed");
        }
      }

      return {order,razorpayOrderId:order.razorpayOrderId,amount}
}


exports.verifyPaymentService = async (paymentId, orderId) => {
  console.log("Verifying payment with:", { paymentId, orderId});
  const order = await Order.findOne({ razorpayOrderId:orderId });
  if (!order ) {
    throw new CustomError("order is not found", 400);
  }
  try {

    

    const paymentDetails = await razorpayInstance.payments.fetch(paymentId);
    if (paymentDetails.status === "captured") {
      order.razorpayPaymentStatus = "paid";
      order.status = "placed";
      //await order.save();
    } else {
      order.razorpayPaymentStatus = paymentDetails.status;
      order.status = "pending";
    }
    await order.save();

    return {
      success:true,
      messsage:"Payment verified successfully",
      paymentStatus:order.razorpayPaymentStatus,
      order
    }
  } catch (error) {
    console.error("Error during payment verification:", error);
    throw new CustomError("Payment verification failed", 500);
  }
};



exports.showOrderService=async(userId)=>{
  const orders = await Order
    .find({ user: userId })
    .populate({
      path:'items.productId',
      model:'product',
      select:'name description price url'
    }); // Populate product details

    console.log("Fetched Orders:", orders); 
  return { orders };
}                                                                                      