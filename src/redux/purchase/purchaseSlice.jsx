import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  archiveIndentRoute,
  deleteIndentRoute,
  forwardIndentRoute,
  viewIndentByUsernameAndRoleRoute,
  viewIndentRoute,
} from "../../routes/purchaseRoutes";

// Fetch all indents
export const fetchIndents = createAsyncThunk(
  "indent/fetchIndents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(viewIndentRoute);
      return response.data;
    } catch (error) {
      console.error("Fetch Indents Error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch indents.",
      );
    }
  },
);

// Delete an indent
export const remove_indent = createAsyncThunk(
  "indent/deleteIndent",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        deleteIndentRoute,
        {
          file_id: id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      fetchIndents();
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete indent.",
      );
    }
  },
);

// Fetch indents by user role
export const fetchIndentByUserRole = createAsyncThunk(
  "indent/fetchIndentByUserRole",
  async ({ username, role }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        viewIndentByUsernameAndRoleRoute(username, role),
        {
          headers: { Authorization: `Token ${token}` },
        },
      );

      console.log("Fetched Indents:", response.data.Data);

      // Ensure Data field exists
      if (!response.data || !response.data.Data) {
        return rejectWithValue("Invalid data format received.");
      }

      return response.data;
    } catch (error) {
      console.error("Fetch Indents by Role Error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch indents.",
      );
    }
  },
);

// Forward an indent
export const forwardIndent = createAsyncThunk(
  "indent/forwardIndent",
  async (indentID, { rejectWithValue }) => {
    try {
      await axios.post(forwardIndentRoute(indentID));
      return indentID;
    } catch (error) {
      console.error("Forward Indent Error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to forward indent.",
      );
    }
  },
);

// Archive an indent
export const archiveIndent = createAsyncThunk(
  "indent/archiveIndent",
  async ({ role, id }, { rejectWithValue }) => {
    try {
      await axios.post(archiveIndentRoute(role, id));
      return id;
    } catch (error) {
      console.error("Archive Indent Error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to archive indent.",
      );
    }
  },
);

const initialState = {
  indents: [],
  status: "idle",
  error: null,
};

const purchaseSlice = createSlice({
  name: "indent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Indents
      .addCase(fetchIndents.pending, (state) => {
        state.status = "loading";
        state.error = null; // Clear previous errors
      })
      .addCase(fetchIndents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.indents = action.payload?.Data || []; // Ensure it's an array
      })
      .addCase(fetchIndents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete Indent
      .addCase(remove_indent.fulfilled, (state, action) => {
        state.indents = state.indents.filter(
          (indent) => indent.id !== action.payload,
        );
      })

      // Fetch Indents by Role
      .addCase(fetchIndentByUserRole.pending, (state) => {
        state.status = "loading";
        state.error = null; // Clear previous errors
      })
      .addCase(fetchIndentByUserRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.indents = action.payload?.Data || []; // Ensure it's an array
      })
      .addCase(fetchIndentByUserRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Forward Indent
      .addCase(forwardIndent.fulfilled, (state, action) => {
        state.indents = state.indents.map((indent) =>
          indent.id === action.payload
            ? { ...indent, status: "forwarded" }
            : indent,
        );
      })

      // Archive Indent
      .addCase(archiveIndent.fulfilled, (state, action) => {
        state.indents = state.indents.filter(
          (indent) => indent.id !== action.payload,
        );
      });
  },
});

export default purchaseSlice.reducer;
