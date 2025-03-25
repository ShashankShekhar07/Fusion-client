import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { viewIndentByUsernameAndRoleRoute2 } from "../../routes/purchaseRoutes";

export const fetchIndentsInbox = createAsyncThunk(
  "inbox/fetchIndentsInbox",
  async ({ username, role }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      console.log(username);
      console.log(role);
      const response = await axios.get(
        viewIndentByUsernameAndRoleRoute2(username, role),
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      return response.data.in_file;
    } catch (err) {
      console.error("Fetch Indents Error:", err);
      return rejectWithValue(
        err.response?.data || "Failed to fetch indents Inbox.",
      );
    }
  },
);

const initialState = {
  inbox: [],
  loading: false,
  error: null,
  success: false,
  fetched: false,
};

const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndentsInbox.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIndentsInbox.fulfilled, (state, action) => {
        state.loading = false;
        state.inbox = action.payload;
        state.error = null;
        state.success = true;
        state.fetched = true;
      })
      .addCase(fetchIndentsInbox.rejected, (state, action) => {
        state.loading = false;
        state.inbox = [];
        state.error = action.error.message;
        state.success = false;
      });
  },
});

export default inboxSlice.reducer;
