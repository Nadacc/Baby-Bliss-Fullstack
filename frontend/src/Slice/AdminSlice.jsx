import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    categories:[],
    product:[],
    logged:false
}

export const FetchProducts = createAsyncThunk('product/FetchProducts',async() => {
    return await axios.get("http://localhost:5000/products")
    .then(response => response.data)
})



export const addData = createAsyncThunk('product/addData',async (newproduct) => {
    return await axios.post("http://localhost:5000/products",newproduct)
    .then(response => response.data)
})


export const deleteProduct = createAsyncThunk('product/deleteProduct',async (id) => {
     await axios.delete(`http://localhost:5000/products/${id}`)
    return id;
})


export const editData = createAsyncThunk('product/editData',async(product) => {
    const {id}=product;
    return await axios.put(`http://localhost:5000/products/${id}`,product)
    .then(response => response.data)

})

const AdminSlice = createSlice({
    name:"admin",
    initialState,
    reducers:{
        setLoggedIn: (state, action) => {
            state.logged = action.payload;
        }
    },
    extraReducers:builder => {
        builder.addCase(FetchProducts.pending,state => {
            state.loading = true
        })
        builder.addCase(FetchProducts.fulfilled,(state,action) => {
            state.loading = false
            state.product = action.payload
            
            console.log('Products fetched',action.payload);

            state.categories = [...new Set(action.payload.map((p) => p.category))]
            
        })
        builder.addCase(FetchProducts.rejected,(state,action) => {
            state.loading = false
            state.product =[]
            state.error = action.error.message
        })

        builder.addCase(addData.fulfilled,(state,action) => {
            state.product.push(action.payload)
        })


        builder.addCase(deleteProduct.fulfilled,(state,action) => {
            state.product = state.product.filter((item) => item.id!==action.payload)
        })


        builder.addCase(editData.fulfilled,(state,action) => {
            state.product = state.product.map((item) => 
            item.id == action.payload.id ? action.payload : item)
        })

    }
})

export const { setLoggedIn } = AdminSlice.actions;
export default AdminSlice.reducer