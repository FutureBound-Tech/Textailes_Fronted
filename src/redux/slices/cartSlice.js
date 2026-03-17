import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const saved = localStorage.getItem('textail_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      // action.payload should contain { id, name, price, images, qty, selectedColor }
      const item = action.payload;
      // create a unique cart item ID based on product ID and selected color
      const cartItemId = item.selectedColor ? `${item.id}-${item.selectedColor}` : item.id;
      
      const existing = state.items.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        existing.qty += item.qty || 1;
      } else {
        state.items.push({ ...item, cartItemId });
      }
      localStorage.setItem('textail_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      // action.payload is cartItemId
      state.items = state.items.filter((i) => i.cartItemId !== action.payload);
      localStorage.setItem('textail_cart', JSON.stringify(state.items));
    },
    updateQty: (state, action) => {
      const { cartItemId, qty } = action.payload;
      const existing = state.items.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        if (qty <= 0) {
          state.items = state.items.filter((i) => i.cartItemId !== cartItemId);
        } else {
          existing.qty = qty;
        }
      }
      localStorage.setItem('textail_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('textail_cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
