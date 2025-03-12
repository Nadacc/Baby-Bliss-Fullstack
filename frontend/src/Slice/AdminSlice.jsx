import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios'
import axiosInstance from '../api/axiosInstance';

const initialState = {
    user: [],
    loading: false,
    error: null,
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1,
    userOrder: [],
    totalRevenues: 0,
    allOrderList: [],
    block:0,
    totalProducts:0,
    product:[],
    pagination:{
      total:0,
      page:1,
      limit:10,
      totalPages:0
    },
  
}




export const getAllUsers = createAsyncThunk(
    "users/getAllUsers",
    async ({ page }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get('/admin/getusers', {
          params: { page: page || 1 },
        });
        console.log(response.data.data);
        return response.data.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Error fetching all users"
        );
      }
    }
);


export const getUserById = createAsyncThunk("users/getUserById",
    async (id, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(
         `/admin/getusers/${id}`
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Error get single users"
        );
      }
    }
);
  


export const blockUser = createAsyncThunk(
    "users/blockUser",
    async (id, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.patch(`/admin/blockUser/${id}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Error blocking/unblocking user"
        );
      }
    }
);
  
export const getUserOrder = createAsyncThunk("order/getUserOrder",
    async (id, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/admin/getUserOrder/${id}`);
        console.log(response.data);
        return response.data || [];
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Error fetching cart"
        );
      }
    }
);
  
export const totalRevenue = createAsyncThunk("users/totalRevenue",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get('/admin/totalRevenue');
        console.log(response.data);
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Error fetching total revenue"
        );
      }
    }
);


const AdminSlice = createSlice({
    name:"admin",
    initialState,
    reducers:{
        setLoggedIn: (state, action) => {
            state.logged = action.payload;
        },
        
    },
    extraReducers:builder => {
        builder

            .addCase(getAllUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getAllUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.users;
            state.totalUsers = action.payload.totalUsers;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage || 1;
          })
          .addCase(getAllUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(getUserById.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getUserById.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
          })
          .addCase(getUserById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(blockUser.pending, (state) => {
            state.loading = true;
          })
          .addCase(blockUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = state.user.map((u) =>
              u._id === action.payload._id
                ? { ...u, isBlock: action.payload.isBlock }
                : u
            );
            state.error = null;
          })
    
          .addCase(blockUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(getUserOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getUserOrder.fulfilled, (state, action) => {
            state.userOrder = action.payload.orders;
            console.log(state.userOrder);
            state.loading = false;
            state.pagination = action.payload.pagination;
          })
          .addCase(getUserOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(totalRevenue.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.totalRevenues = action.payload.totalRevenue;
            state.totalProducts = action.payload.totalPurchasedProducts;
          })

    }
})

export const { setLoggedIn } = AdminSlice.actions;
export default AdminSlice.reducer