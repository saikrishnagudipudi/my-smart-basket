import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrls: string[];
  qty?: number;
}

interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const exists = state.cartItems.find(i => i.id === item.id);
      if (exists?.qty) {
        exists.qty += 1;
      } else {
        state.cartItems.push({ ...item, qty: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const exists = state.cartItems.find(i => i.id === id);
      if (exists && exists.qty && exists.qty > 1) {
        exists.qty -= 1;
      } else {
        state.cartItems = state.cartItems.filter(p => p.id !== id);
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
