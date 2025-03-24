import { createSlice } from "@reduxjs/toolkit";

const pfNoSlice = createSlice({
  name: "pfNo",
  initialState: {
    value: null,
  },

  reducers: {
    setPfNo: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setPfNo } = pfNoSlice.actions;
export default pfNoSlice.reducer;
