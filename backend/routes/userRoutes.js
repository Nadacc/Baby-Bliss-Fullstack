const express=require('express')

const router=express.Router()
const {registerUser,loginUser,refreshToken, getLoggedInUser, logoutUser}=require('../controllers/userController')
const authenticate = require('../middlewares/authMiddleware')

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/refreshtoken',refreshToken)
router.get('/me',authenticate,getLoggedInUser)
router.post('/logout',logoutUser)

module.exports=router