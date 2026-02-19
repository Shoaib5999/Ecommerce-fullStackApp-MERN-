import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios"

export const fetchProductsPerPage = createAsyncThunk(
  "product/fetchProductsPerPage",
  async (page, {rejectWithValue}) => {
    try{
      const {data} = await axios.post(`/api/v1/products/get-products-per-page/${page}`,{checked:[]});
      console.log("response of products per page", data);
      return data;
    }catch(error){
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch products per page");
    }
  }
)

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    loading: false,
    error: null,
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
    page: 1,
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.hasNextPage = action.payload.hasNextPage;
      state.hasPreviousPage = action.payload.hasPreviousPage;
      state.totalCount = action.payload.totalCount;
      state.loading = false;
      state.error = null;
      state.page = action.payload.page;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsPerPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsPerPage.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.hasNextPage = action.payload.hasNextPage;
        state.hasPreviousPage = action.payload.hasPreviousPage;
        state.totalCount = action.payload.totalCount;
        state.page = action.payload.page ?? state.page;
        state.error = null;
      })
      .addCase(fetchProductsPerPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch products per page";
        state.products = [];
        state.hasNextPage = false;
        state.hasPreviousPage = false;
        state.totalCount = 0;
      });
  },
});

export const { setProducts, setLoading, setError, setPage } = productSlice.actions;
export default productSlice.reducer;