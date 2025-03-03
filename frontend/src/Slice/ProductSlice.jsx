import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";

const initialState = {
    loading:false,
    products:[],
    error:''
}

export const FetchProducts = createAsyncThunk('product/FetchProducts',async() => {
    return await axiosInstance.get("/users/products")
    .then(response => {
        console.log("Fetched Data:", response.data.product); // Debugging log
        return response.data.product; // Ensure it returns an array
    })
    .catch(error => {
        console.error("Error fetching products:", error);
        throw error;
    });
})

const ProductSlice = createSlice({
    name:'product',
    initialState,
    extraReducers:builder => {
        builder.addCase(FetchProducts.pending,state => {
            state.loading = true
        })
        builder.addCase(FetchProducts.fulfilled, (state, action) => {
            //console.log(' Fetched Products in Redux:', action.payload); 
            state.loading = false;
            state.products = action.payload; // Ensure this is an array
            state.error = '';
        });
        
        
        
        builder.addCase(FetchProducts.rejected,(state,action) => {
            state.loading = false
            state.products =[]
            state.error = action.error.message
        })
    }
})

export default ProductSlice.reducer