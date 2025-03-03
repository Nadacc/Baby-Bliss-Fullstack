import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify"; 

const API_BASE = "http://localhost:5000";
const initialState = {
    users: [],
    cart: [],
    cartCount: 0,
    wishlist: [],
    loading: false,
    isLoggedIn: false
};

export const FetchUsers = createAsyncThunk('user/FetchUser', async (userId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_BASE}/users/${userId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ product, userId }, { rejectWithValue }) => {
    try {
        const userResponse = await axios.get(`${API_BASE}/users/${userId}`);
        const userCart = userResponse.data.cart || [];
        const updatedCart = [...userCart];

        const existingProductIndex = updatedCart.findIndex((item) => item.id === product.id);

        if (existingProductIndex !== -1) {
            updatedCart[existingProductIndex].quantity += 1;
            toast.success("Increased the quantity of the same item in your cart");
        } else {
            updatedCart.push({ ...product, quantity: 1 });
            toast.success("Item added to your cart");
        }

        await axios.patch(`${API_BASE}/users/${userId}`, { cart: updatedCart });
        return updatedCart;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to add item to cart");
    }
});

export const updateCartItemQuantity = createAsyncThunk('cart/updateItem', async ({ productId, newQuantity, userId, cart }, { dispatch, rejectWithValue }) => {
    try {
        if (newQuantity < 1) {
            await dispatch(removeFromCart({ productId, cart, userId }));
            toast.info("Item removed from your cart!");
            return cart.filter(item => item.id !== productId);
        }

        const newCart = cart.map((item) => item.id === productId ? { ...item, quantity: newQuantity } : item);
        await axios.patch(`${API_BASE}/users/${userId}`, { cart: newCart });

        return newCart;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update cart item");
    }
});

export const removeFromCart = createAsyncThunk('cart/removeItem', async ({ productId, cart, userId }, { rejectWithValue }) => {
    try {
        const updatedCart = cart.filter(item => item.id !== productId);
        await axios.patch(`${API_BASE}/users/${userId}`, { cart: updatedCart });
        toast.info("Item removed from your cart!");
        return updatedCart;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to remove item from cart");
    }
});

export const addToWishlist = createAsyncThunk(
    'wishlist/add',
    async ({ product, userId }, { rejectWithValue }) => {
        if (!userId) return rejectWithValue("User ID is missing");

        try {
            const userResponse = await axios.get(`${API_BASE}/users/${userId}`);
            const wishlist = userResponse.data.wishlist || [];

            if (wishlist.some((item) => item.id === product.id)) {
                toast.info('Item is already in the wishlist');
                return wishlist;
            }

            const updatedList = [...wishlist, product];
            await axios.patch(`${API_BASE}/users/${userId}`, { wishlist: updatedList });
            toast.success('Item added to your wishlist');
            return updatedList;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add item to wishlist");
        }
    }
);


export const removeFromWishlist = createAsyncThunk('wishlist/remove', async ({ productId, userId }, { rejectWithValue }) => {
    try {
        const userResponse = await axios.get(`${API_BASE}/users/${userId}`);
        const wishlist = userResponse.data.wishlist || [];
        const updatedWishlist = wishlist.filter((item) => item.id !== productId);
        await axios.patch(`${API_BASE}/users/${userId}`, { wishlist: updatedWishlist });
        toast.info('Item removed from your wishlist');
        return updatedWishlist;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to remove item from wishlist");
    }
});



export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
    const userId = localStorage.getItem('id');
    
    if (!userId) {
        return rejectWithValue("User ID is missing");
    }

    try {
        await axios.patch(`${API_BASE}/users/${userId}`, { cart: [] });
        return [];
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to clear cart");
    }
});


const ShopSlice = createSlice({
    name: 'shop',
    initialState,
    extraReducers: builder => {
        builder.addCase(FetchUsers.pending, state => { state.loading = true; })
               .addCase(FetchUsers.fulfilled, (state, action) => {
                   state.loading = false;
                   state.cart = action.payload.cart;
                   state.cartCount = action.payload.cart.length;
                   state.wishlist = action.payload.wishlist;
               })
               .addCase(FetchUsers.rejected, state => { state.loading = false; state.users = []; })
               .addCase(addToCart.fulfilled, (state, action) => {
                   state.cart = action.payload;
                   state.cartCount = action.payload.length;
               })
               .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                   state.cart = action.payload;
                   state.cartCount = action.payload.length;
               })
               .addCase(removeFromCart.fulfilled, (state, action) => {
                   state.cart = action.payload;
                   state.cartCount = action.payload.length;
               })
               .addCase(clearCart.fulfilled, (state) => {   
                state.cart = [];
                state.cartCount = 0;
            })
               .addCase(addToWishlist.fulfilled, (state, action) => {
                   state.wishlist = action.payload;
               })
               .addCase(removeFromWishlist.fulfilled, (state, action) => {
                   state.wishlist = action.payload;
               });
               
    }
});

export default ShopSlice.reducer;
