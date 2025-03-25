import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { archiveViewRoute } from "../../routes/purchaseRoutes";

export const fetchArchived = createAsyncThunk(
  "indents/fetchArchived",
  async ({ username, role }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(archiveViewRoute(username, role), {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return response.data.archieves;
    } catch (error) {
      console.error("Fetch Indents Error:", error);
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

const archivedSlice = createSlice({
  name: "indents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchived.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchArchived.fulfilled, (state, action) => {
        state.loading = false;
        state.indents = action.payload;
        state.error = null;
        state.success = true;
        state.fetched = true;
      })
      .addCase(fetchArchived.rejected, (state, action) => {
        state.loading = false;
        state.indents = [];
        state.error = action.error.message;
        state.success = false;
      });
  },
});

export default archivedSlice.reducer;
