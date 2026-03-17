import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../lib/apiClient';

// Admin Thunks
export const fetchProducts = createAsyncThunk('products/fetchAdmin', async (params, thunkAPI) => {
  try {
    const response = await apiClient.get('/admin/products', { params });
    return response.data; // usually { items, total, page }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

export const createProduct = createAsyncThunk('products/create', async (formData, thunkAPI) => {
  try {
    const response = await apiClient.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create product');
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, formData }, thunkAPI) => {
  try {
    const response = await apiClient.put(`/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
  try {
    await apiClient.delete(`/admin/products/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete product');
  }
});

// Public Thunks
export const fetchPublicProducts = createAsyncThunk('products/fetchPublic', async (params, thunkAPI) => {
  try {
    const response = await apiClient.get('/products', { params });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch public products');
  }
});

export const fetchPublicProductById = createAsyncThunk('products/fetchOne', async (id, thunkAPI) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    total: 0,
    page: 1,
    currentProduct: null,
    status: 'idle', // idle | loading | succeeded | failed
    currentStatus: 'idle',
    error: null,
    publicError: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Admin Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items || action.payload;
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id || p._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload && p._id !== action.payload);
      })
      // Public Fetch
      .addCase(fetchPublicProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPublicProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items || action.payload;
      })
      // Public Fetch One
      .addCase(fetchPublicProductById.pending, (state) => {
        state.currentStatus = 'loading';
      })
      .addCase(fetchPublicProductById.fulfilled, (state, action) => {
        state.currentStatus = 'succeeded';
        state.currentProduct = action.payload;
      })
      .addCase(fetchPublicProductById.rejected, (state, action) => {
        state.currentStatus = 'failed';
        state.publicError = action.payload;
      });
  }
});

export default productSlice.reducer;
