import { createSlice } from "@reduxjs/toolkit";

const moduleSlice = createSlice({
  name: "module",
  initialState: {
    current_module: "Home",
    active_tab: "Notifications",
  },

  reducers: {
    setCurrentModule: (state, action) => {
      state.current_module = action.payload;
    },
    setActiveTab_: (state, action) => {
      state.active_tab = action.payload;
    },
  },
});

export const { setCurrentModule, setActiveTab_ } = moduleSlice.actions;
export default moduleSlice.reducer;
