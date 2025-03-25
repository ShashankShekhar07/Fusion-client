import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { outboxViewRoute2 } from "../../routes/purchaseRoutes";

export const fetchIndentsOutbox = createAsyncThunk(
  "outbox/fetchIndentsOutbox",
  async ({ username, role }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(outboxViewRoute2(username, role), {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return response.data.in_file;
    } catch (err) {
      console.error("Fetch Indents Error:", err);
      return rejectWithValue(
        err.response?.data || "Failed to fetch indents Outbox.",
      );
    }
  },
);

const initialState = {
  outbox: [],
  loading: false,
  error: null,
  success: false,
  fetched: false,
};

const outboxSlice = createSlice({
  name: "outbox",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndentsOutbox.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIndentsOutbox.fulfilled, (state, action) => {
        state.loading = false;
        state.outbox = action.payload;
        state.error = null;
        state.success = true;
        state.fetched = true;
      })
      .addCase(fetchIndentsOutbox.rejected, (state, action) => {
        state.loading = false;
        state.outbox = [];
        state.error = action.error.message;
        state.success = false;
      });
  },
});

export default outboxSlice.reducer;
