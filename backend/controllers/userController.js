const asyncHandler = require('../utils/asyncHandler')
const STATUS = require('../utils/constants')
const {userRegisterServices,userLoginServices, getUserDetails} = require('../services/userService')
const {registerValidation} = require('../validation/userValidation')
const User = require('../models/userModel')
const CustomError = require('../utils/customError')
const {generateAccessToken,generateRefreshToken} = require('../utils/jwt')
const {refreshAccessTokenService} = require('../services/userService')


//register
exports.registerUser = asyncHandler(async (req, res) => {
    const data = req.body;
    const { error } = registerValidation.validate(data);
    if (error) throw new CustomError(error.details[0].message, 400);
    const newUser = await userRegisterServices(data);
  
    res.status(201).json({
      status: STATUS.SUCCESS,
      message:newUser.isAdmin
      ? "Admin registered successfully"
      : "User registered successfully" 
    });
});



//login
exports.loginUser = asyncHandler(async(req,res) => {
    const {email,password} = req.body;
    console.log("Received",email,password);
    
    //const {error} = loginValidation.validate({email,password})
    //if (error) throw new CustomError(error.details[0].message,400)
    const User = await userLoginServices(email,password)


    const accessToken = generateAccessToken(User)
    console.log(accessToken);
    
    const refreshToken = generateRefreshToken(User)
    console.log(refreshToken);
    
    res
        .cookie("accessToken",accessToken,{
            httpOnly:true,
            secure:false,
            maxAge:15*60*1000
        })
        .cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:false,
            maxAge:7*24*60*60*1000
        })
        .status(200)
        .json({
            status:STATUS.SUCCESS,
            message:User.isAdmin
                ? "Admin Login successfully"
                : "User Login successfully" ,
            user:{name:User.name,
                email:User.email,
                isAdmin:User.isAdmin
            }
        })
})


//create new accessToken
exports.refreshToken = asyncHandler(async(req,res) => {
    const {refreshToken} = req.cookies;

    const {newAccessToken} = await refreshAccessTokenService(refreshToken);
    res
        .cookie("accessToken",newAccessToken,{
            httpOnly:true,
            secure:false,
            maxAge:15*60*1000,
        })
        .status(200)
        .json({
            status:STATUS.SUCCESS,
            message:"Access token refreshed"
        })
})


exports.getLoggedInUser = asyncHandler(async(req,res) => {
    const user = await getUserDetails(req.user._id);
    if(!user){
        throw new CustomError('User not found',404);
    }
    res.status(200).json({user});
})
  