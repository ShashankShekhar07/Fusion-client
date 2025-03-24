import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userslice";
import moduleReducer from "./moduleslice";
import pfReducer from "./pfNoSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    module: moduleReducer,
    pfNo: pfReducer,
  },
});
