import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify"; 
import axiosInstance from "../api/axiosInstance";


const initialState = {
    
    cart: [],
    cartCount: 0,
    wishlist: [],
    loading: false,
    error:null
};

// Fetch cart items
export const getCart = createAsyncThunk(
    "cart/getCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/users/getCart");
            console.log("Cart API Response:", response.data); // Debugging
            return response.data.cart;  // Ensure this contains products
        } catch (error) {
            console.error("Error fetching cart:", error);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
        }
    }
);
;
  
  // Add item to cart
  export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (productId, { dispatch, rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(`/users/cart/${productId}`);
        dispatch(getCart()); // Fetch updated cart
        return response.data.cart;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add item to cart");
      }
    }
  );
  
  // Remove item from cart
  export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (productId, { dispatch, rejectWithValue }) => {
      try {
        await axiosInstance.delete(`/users/deleteCart/${productId}`);
        console.log(productId);
        return productId
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to remove item from cart");
      }
    }
  );

export const updateCartItemQuantity = createAsyncThunk('cart/updateItem', async ({ productId, action }, { dispatch,getState, rejectWithValue }) => {
    try {
        const response = await axiosInstance.put(`/users/cart/${productId}`, {action});
        await dispatch(getCart())

        const updatedCart = getState().shop.cart;
            if (updatedCart.length === 0) {
                dispatch(clearCart()); // Force clearing cart state when empty
            }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update cart item");
    }
});



export const getWishlist = createAsyncThunk(
    'wishlist/getWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/users/getWishlist");
            console.log("Fetched Wishlist from API:", response.data);
            return response.data.wishlist; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
        }
    }
);



export const addToWishlist = createAsyncThunk(
    'wishlist/add',
    async (productId, { rejectWithValue }) => {
        
        try {
            const response = await axiosInstance.post(`/users/addWishlist/${productId}`);
            return response.data.wishlist
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add item to wishlist");
        }
    }
);


export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`/users/deleteWishlist/${productId}`);
        
        return response.data.wishlist;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to remove item from wishlist");
    }
});



// export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
//     const userId = localStorage.getItem('id');
    
//     if (!userId) {
//         return rejectWithValue("User ID is missing");
//     }

//     try {
//         await axios.patch(`${API_BASE}/users/${userId}`, { cart: [] });
//         return [];
//     } catch (error) {
//         return rejectWithValue(error.response?.data || "Failed to clear cart");
//     }
// });


const ShopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers:{
        //setCart:(state) => state.cart = [],
        clearCart:(state) => {
            state.cart = [];
        }
    },
    extraReducers: (builder) => {
        builder
          // Get cart
                .addCase(getCart.pending, (state) => {
                    state.loading = true;
                })
                .addCase(getCart.fulfilled, (state, action) => {
                    state.loading = false;
                    console.log("Cart data received:", action.payload);
                    if (!action.payload || !Array.isArray(action.payload.products)) {
                        state.error = "Invalid cart data received";
                        return;
                    }

                    state.cart = action.payload.products.map((item) => ({
                    id: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    url: item.product.url,
                    quantity: item.quantity,
                    available: item.product.quantity,
                    }));
                })
                .addCase(getCart.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
            
                // Add to cart
                .addCase(addToCart.pending, (state) => {
                    state.loading = true;
                })
                .addCase(addToCart.fulfilled, (state) => {
                    state.loading = false;
                    state.error = null;
                })
                .addCase(addToCart.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
            
                // Remove from cart
                .addCase(removeFromCart.pending, (state) => {
                    state.loading = true;
                })
                .addCase(removeFromCart.fulfilled, (state,action) => {
                    state.loading = false;
                    state.error = null;
                    state.cart = state.cart.filter(item => item.id !== action.payload);

                    if (state.cart.length === 0) {
                        state.cart = []; 
                    }
                })
                .addCase(removeFromCart.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
            
            //    .addCase(clearCart.fulfilled, (state) => {   
            //     state.cart = [];
            //     state.cartCount = 0;
            // })
            .addCase(getWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.loading = false;
                console.log("Wishlist data received:", action.payload);
                if (!action.payload || !Array.isArray(action.payload.products)) {
                    state.error = "Invalid wishlist data received";
                    return;
                }

                state.wishlist = action.payload.products.map((item) => ({
                _id: item._id,
                name: item.name,
                price: item.price,
                url: item.url,
                quantity: item.quantity,
                available: item.quantity,
                }));
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
        
               .addCase(addToWishlist.fulfilled, (state, action) => {
                state.loading=false;
                state.error=null;
               })
               .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.wishlist = state.wishlist.filter(item => item._id !== action.meta.arg);
               });
               
    }
});

export const {clearCart} = ShopSlice.actions
export default ShopSlice.reducer;
