import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";


export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/wishlist");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.post("/wishlist/toggle", { productId });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
  builder
  
    .addCase(fetchWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchWishlist.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    })
    .addCase(fetchWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(toggleWishlist.pending, (state) => {
      state.loading = true;
    })
    .addCase(toggleWishlist.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    })
    .addCase(toggleWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
},

});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;