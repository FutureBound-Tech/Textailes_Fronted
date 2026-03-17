import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../lib/apiClient';

export const fetchOrders = createAsyncThunk('orders/fetch', async (_, thunkAPI) => {
  try {
    const { data } = await apiClient.get('/admin/orders');
    return data.items || data;
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to load orders');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, orderStatus }, thunkAPI) => {
  try {
    const { data } = await apiClient.put(`/admin/orders/${id}`, { orderStatus });
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to update order');
  }
});

export const createOrder = createAsyncThunk('orders/createOrder', async (payload, thunkAPI) => {
  try {
    const { data } = await apiClient.post('/orders', payload);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to create order');
  }
});

export const fetchUserOrders = createAsyncThunk('orders/fetchUser', async (_, thunkAPI) => {
  try {
    const { data } = await apiClient.get('/orders');
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue('Failed to load user orders');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.items = state.items.map((o) => (o._id === action.payload._id ? action.payload : o));
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
