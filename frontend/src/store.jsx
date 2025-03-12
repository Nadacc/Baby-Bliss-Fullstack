import {configureStore} from '@reduxjs/toolkit'
import ProductReducer from './Slice/ProductSlice'
import AdminReducer from './Slice/AdminSlice'
import ShopReducer from './Slice/ShopSlice'
import authReducer from './Slice/authSlice'
import orderReducer from './Slice/orderSlice'

const store = configureStore({
    reducer:{
        product:ProductReducer,
        admin:AdminReducer,
        shop:ShopReducer,
        auth:authReducer,
        order:orderReducer,
    }
})

export default store