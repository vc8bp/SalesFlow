import { productSizes } from '@/types/data';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Cart {
  _id: string;
  name: string;
  productNo: string;
  price: number;
  img: string;
  size: typeof productSizes[number];
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
        console.log(action.payload.size)
        const existingItem = state.find((item) => item._id === action.payload._id && item.size === action.payload.size);
        
        if (existingItem) {
            existingItem.quantities = existingItem.quantities + action.payload.quantities;
        } else {
          // If the product is new, add it to the cart
          state.push(action.payload);
        }
        
        syncToLocalStorage(state);
      },
  
      update: (state, action: PayloadAction<Cart>) => {
        const updatedState = state.map((item) =>{
          console.log({s: action.payload.size, ss: item.size})
          return item._id === action.payload._id && item.size === action.payload.size
            ? { ...item, quantities: action.payload.quantities }
            : item
        });
        
        syncToLocalStorage(updatedState);
        return updatedState;
      },
  
      remove: (state, action: PayloadAction<{ _id: string; size: string }>) => {
        console.log({action: action.payload})
        const updatedState = state.filter(
          (item) => !(item._id === action.payload._id && item.size === action.payload.size)
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
