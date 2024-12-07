import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Cart {
  _id: string;
  name: string;
  productNo: string;
  price: number;
  img: string;
  color: "" | "dark" | "light";
  quantities: number ;
}

const localStorageKey = "cart";
const isBrowser = typeof window !== "undefined";

const getInitialState = (): Array<Cart> => {
  if (isBrowser) {
    const storedCart = localStorage.getItem(localStorageKey);
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return []; 
};
const initialState: Array<Cart> = getInitialState();

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      addToCart: (state, action: PayloadAction<Cart>) => {
        const existingItem = state.find((item) => item._id === action.payload._id && item.color === action.payload.color);
        
        if (existingItem) {
            existingItem.quantities = existingItem.quantities + action.payload.quantities;
        } else {
          // If the product is new, add it to the cart
          state.push(action.payload);
        }
        
        syncToLocalStorage(state);
      },
  
      update: (state, action: PayloadAction<Cart>) => {
        const updatedState = state.map((item) =>
          item._id === action.payload._id && item.color === action.payload.color
            ? { ...item, quantities: action.payload.quantities }
            : item
        );
        
        syncToLocalStorage(updatedState);
        return updatedState;
      },
  
      remove: (state, action: PayloadAction<{ _id: string; color: string }>) => {
        const updatedState = state.filter(
          (item) => !(item._id === action.payload._id && item.color === action.payload.color)
        );
        
        syncToLocalStorage(updatedState);
        return updatedState;
      },
      clearCart: (state) => {
        syncToLocalStorage([]);
        return [];
      },
    },
  });
  

const syncToLocalStorage = (state: Array<Cart>) => {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
};

export const { addToCart, update, remove, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
