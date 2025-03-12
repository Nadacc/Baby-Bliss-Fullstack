import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";


export const addOrder=createAsyncThunk("order/addOrder",async(orderData,{rejectWithValue})=>{
    console.log(orderData)
    try{
        const response=await axiosInstance.post('/users/addOrder',orderData)
        console.log(response.data.order)
        return response.data
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message ||"Error in place order")
    }
})

export const verifypayment=createAsyncThunk("order/verifypayment",async(paymentData,{rejectWithValue})=>{
  console.log("Sending Payment Data to Backend:", paymentData);
  
    try{
        const response=await axiosInstance.post('/users/verifypayment',paymentData)
        console.log("Payment verification response:", response.data)
        return response.data
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message || "Error in payment verification")
    }
})

export const showOrders= createAsyncThunk(
    'order/showOrders',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get('/users/showOrder');
        console.log(response.data.orders)
        return response.data.orders;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Error in get orders");
      }
    }
  );


const orderSlice=createSlice({
    name:"order",
    initialState:{
        order:[],
        
        paymentVerified:false,
        loading:false,
        error:null
    },
    extraReducers: (builder) => {
        builder
          .addCase(addOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(addOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.order=action.payload.order.items;
          })
          .addCase(addOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(verifypayment.pending,(state)=>{
            state.loading=true
            state.error=null
          })
          .addCase(verifypayment.fulfilled,(state,action)=>{
            if (action.payload.paymentVerified) {
                state.paymentVerified = true;
                state.order = state.order.map((order) => 
                  order.razorpayOrderId === action.payload.order.razorpayOrderId
                  ?{...order,razorpayPaymentStatus:"fulfilled"}
                  : order
                )
              } else {
                console.error("Payment verification response missing 'paymentVerified'");
              }
            state.loading = false
            // state.paymentVerified=true
            // state.order.paymentVerified=true
          })
          .addCase(verifypayment.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
          })
          .addCase(showOrders.pending,(state)=>{
            state.loading=true
            state.error=null
          })
          .addCase(showOrders.fulfilled,(state,action)=>{
            console.log("Orders fetched:", action.payload);
            state.order = action.payload || [];
            state.loading=false
          })
          .addCase(showOrders.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
        })
    }
})

export default orderSlice.reducer