import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";

const initialState = {
    loading:false,
    products:[],
    error:null,
    pagination:{
        total:0,
        page:1,
        limit:9,
        totalPages:0
    },
    categories:[],
    totalProduct:0,
    
    
}

export const FetchProducts = createAsyncThunk(
    "product/FetchProducts",
    async ({ page = 1, category = null, search = null }, { rejectWithValue }) => {
      try {
        const params = { page};
        if (category && category!=='All') params.category = category; // Ensure only non-null categories are sent
        if(search) params.search = search;
  
        const response = await axiosInstance.get("/users/products", { params });
        console.log("product API response",response.data);
        
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Error fetching products"
        );
      }
    }
  );





  export const addproduct = createAsyncThunk("products/addproduct", async (formData, { rejectWithValue }) => {
    try {
        

        const response = await axiosInstance.post('/admin/addproduct', formData, {
            headers: {
                "Content-Type": "multipart/form-data", // ✅ Important for file upload
            },
        });

        console.log(response.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Error adding product");
    }
});


//delete Product
export const deleteProduct=createAsyncThunk("products/deleteProduct",async(productId,{rejectWithValue})=>{
    try{
        await axiosInstance.delete(`/admin/deleteproduct/${productId}`)
        return productId
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message ||error.message || "Error deleting product")
    }
})


//edit Product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    console.log("Updating product with ID:", id, "and data:", data);
    if (!id) {
      return rejectWithValue("Product ID is missing");
  }

    try {
      const response = await axiosInstance.put(`/admin/updateproduct/${id}`, data, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log("Full API response:", response.data); // Debugging log

      return response.data.updatedProduct; // Return the whole response for now
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Error updating Product");
    }
  }
);



const ProductSlice = createSlice({
    name:'product',
    initialState,
    reducers:{
        setCategory:(state,action) => {
            state.categories = action.payload
        }
    },
    extraReducers:builder => {
        builder
        .addCase(FetchProducts.pending,state => {
            state.loading = true,
            state.error = null
        })
        .addCase(FetchProducts.fulfilled, (state, action) => {
            console.log(' Fetched Products in Redux:', action.payload); 
            state.loading = false;
            state.products = action.payload.product ||[]; // Ensure this is an array
            state.pagination = action.payload.pagination ;
            state.totalProduct = action.payload.pagination.total;
            

        })
        .addCase(FetchProducts.rejected,(state,action) => {
            state.loading = false
            //state.products =[]
            state.error = action.error.message
        })
        .addCase(addproduct.pending,(state)=>{
          state.loading=true
          state.error=null
        })
        .addCase(addproduct.fulfilled,(state,action)=>{
          state.loading=false
          state.products.push(action.payload)
        })
        .addCase(addproduct.rejected,(state,action)=>{
          state.loading=false
          state.error=action.payload
        })
        //delete
        .addCase(deleteProduct.pending,(state)=>{
          state.loading=true
          state.error=null
        })
        .addCase(deleteProduct.fulfilled,(state,action)=>{
          state.loading=false
          state.products=state.products.filter((product)=>product._id!==action.payload)
        })
        .addCase(deleteProduct.rejected,(state,action)=>{
          state.loading=false
          state.error=action.payload
        })
        //update
        .addCase(updateProduct.pending,(state)=>{
          state.loading=true
          state.error=null
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
          state.loading = false;
      
          const updatedProduct = action.payload; // ✅ Directly use the payload
      
          if (updatedProduct) {  
              state.products = state.products.map((product) =>
                  product._id === updatedProduct._id ? updatedProduct : product
              );
          } else {
              console.warn("Updated product not returned from API. No state update performed.");
          }
      })
      
      
        .addCase(updateProduct.rejected,(state,action)=>{
          state.loading=false
          state.error=action.payload
        })
    }
})

export const {setCategory} = ProductSlice.actions
export default ProductSlice.reducer