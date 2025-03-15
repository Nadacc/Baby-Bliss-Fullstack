const jwt = require('jsonwebtoken')
const CustomError = require('../utils/customError')

exports.generateAccessToken = (user) => {
    const payload = {id:user._id}
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'30m'})
}

exports.generateRefreshToken=(user)=>{
    const payload={id:user._id}
    return jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:"7d"}) //7 days issue new access token
}


exports.verifyToken=(token,secret)=>{
    try{
        return jwt.verify(token,secret)
    }
    catch(error){
        //return null
        throw new CustomError("Invalid or expired token", 403);
    }
}