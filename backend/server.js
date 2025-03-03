const express=require('express')
const connectDB = require('./config/db')

const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes= require('./routes/cartRoutes')
const wishlistRoutes = require('./routes/wishlistRoutes')
const orderRoutes = require('./routes/orderRoutes')
const adminRoutes = require('./routes/adminRoutes')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express()
require('dotenv').config()
const errorHandler = require('./middlewares/errorHandler')

connectDB();

const corsOptions = {
    origin:process.env.CLIENT_URL,
    methods:["GET","POST","PUT","DELETE","PATCH"],
    credentials:true
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser());
app.use('/api/users',userRoutes)
app.use('/api/users',productRoutes)
app.use('/api/users',cartRoutes)
app.use('/api/users',wishlistRoutes)
app.use('/api/users',orderRoutes)
app.use('/api/admin',adminRoutes)

app.use(errorHandler)
const PORT = process.env.PORT ;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})