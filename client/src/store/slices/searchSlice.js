import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (keyword, { rejectWithValue }) => {
    try {
      if (!keyword || !keyword.trim()) {
        return { results: [], keyword: keyword?.trim() ?? "" };
      }
      const { data } = await axios.get(
        `/api/v1/products/search/${encodeURIComponent(keyword.trim())}`
      );
      return {
        results: data?.results ?? [],
        keyword: keyword.trim(),
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Search failed"
      );
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    keyword: "",
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload;
      state.error = null;
    },
    clearSearch: (state) => {
      state.keyword = "";
      state.results = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.keyword = action.payload.keyword;
        state.error = null;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Search failed";
        state.results = [];
      });
  },
});

export const { setKeyword, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
