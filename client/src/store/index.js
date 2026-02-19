import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./slices/searchSlice";
import productReducer from "./slices/productSlice";
export const store = configureStore({
  reducer: {
    search: searchReducer,
    product: productReducer,
  },
});
