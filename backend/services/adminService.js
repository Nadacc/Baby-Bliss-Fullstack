
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const CustomError = require("../utils/customError");

exports.getAllUserService = async (limits, skips) => {
  const usersList = await User.find({ isAdmin: { $ne: true } })
    .skip(skips)
    .limit(limits);
  const totalUsers = await User.countDocuments({ isAdmin: { $ne: true } });
  return { usersList, totalUsers };
};



exports.singleUserService = async (id) => {
    const users = await User.findById(id);
    if (!users) {
      throw new CustomError("user not found", 400);
    }
    return users;
};


exports.userBlockService = async (id) => {
  const userDetails = await User.findById(id);
  if (!userDetails) {
    throw new CustomError("user not found", 400);
  }
  userDetails.isBlock = !userDetails.isBlock;
  userDetails.save();
  return userDetails;
};


exports.totalRevenueService = async () => {
  const result = await Order.aggregate([
    {
      $unwind: "$items", 
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" }, 
        totalPurchasedProducts: { $sum: "$items.quantity" }, 
      },
    },
  ]);

  return result.length > 0
    ? result[0]
    : { totalRevenue: 0, totalPurchasedProducts: 0 };
};



exports.showOrderServices = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit; 
  const total = await Order.countDocuments({ user: userId });
  const orders = await Order.find({ user: userId })
    .populate({ path: 'items.productId', model: 'product' })
    .skip(skip)
    .limit(limit);

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};