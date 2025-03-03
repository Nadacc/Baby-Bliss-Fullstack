const asyncHandler = require("../utils/asyncHandler");
const STATUS = require("../utils/constants");
const {getAllUserService,singleUserService,userBlockService,totalRevenueService} = require("../services/adminService");


exports.allUsers = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const pageInt = parseInt(page, 10) || 1;
  const limit = 10;
  const skip = (pageInt - 1) * limit;
  const { usersList, totalUsers } = await getAllUserService(limit, skip);
  const message = usersList.length ? "User list" : "No users found";
  const totalPages = Math.ceil(totalUsers / limit);
  res.json({
    status: STATUS.SUCCESS,
    message,
    data: { users: usersList, totalUsers, totalPages, currentPage: pageInt },
  });
});


exports.singleUsers = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await singleUserService(id);
    res.json({ status: STATUS.SUCCESS, message: "user details...", user });
});



exports.userBlock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userBlockService(id);
  const message = user.isBlock ? "User is Block" : "User is Unblock";
  res.json({ status: STATUS.SUCCESS, message });
});



exports.totalRevenue = asyncHandler(async (req, res) => {
  const { totalRevenue, totalPurchasedProducts } = await totalRevenueService();

  res.json({
    status: STATUS.SUCCESS,
    message: "Total Revenue and Purchased Products",
    totalRevenue,
    totalPurchasedProducts,
  });
});
