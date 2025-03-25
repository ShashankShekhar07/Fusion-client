import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import { draftViewRoute } from "../../routes/purchaseRoutes";

export const fetchIndents = createAsyncThunk(
  "Indent/fetchIndents",
  async ({ username }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(draftViewRoute(username), {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return response.data.files;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch indents.",
      );
    }
  },
);

const initialState = {
  indents: [],
  loading: false,
  error: null,
  success: false,
  fetched: false,
};

const savedIndentSlice = createSlice({
  name: "indents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIndents.fulfilled, (state, action) => {
        state.loading = false;
        state.indents = action.payload;
        state.error = null;
        state.success = true;
        state.fetched = true;
      })
      .addCase(fetchIndents.rejected, (state, action) => {
        state.loading = false;
        state.indents = [];
        state.error = action.error.message;
        state.success = false;
      });
  },
});

export default savedIndentSlice.reducer;
