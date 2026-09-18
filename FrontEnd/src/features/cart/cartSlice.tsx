import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// شكل بيانات المنتج اللي هيتحفظ
interface ProductItem {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
}

// الحالة المبدئية للسلة والمفضلة
interface CartState {
  cartItems: ProductItem[];
  wishlistItems: ProductItem[];
}

const initialState: CartState = {
  cartItems: [],
  wishlistItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ProductItem>) => {
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity! += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; amount: number }>) => {
      const item = state.cartItems.find(item => item.id === action.payload.id);
      if (item) {
        const newQuantity = (item.quantity || 1) + action.payload.amount;
        if (newQuantity > 0) item.quantity = newQuantity;
      }
    },
    addToWishlist: (state, action: PayloadAction<ProductItem>) => {
      const exists = state.wishlistItems.find(item => item.id === action.payload.id);
      if (!exists) {
        state.wishlistItems.push(action.payload);
      }
    },
removeFromWishlist: (state, action: PayloadAction<number>) => {
  state.wishlistItems = state.wishlistItems.filter(item => item.id !== action.payload);
},
}
});

export const { addToCart, removeFromCart, updateQuantity, addToWishlist,removeFromWishlist } = cartSlice.actions;export default cartSlice.reducer;