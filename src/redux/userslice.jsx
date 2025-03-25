import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    username: "User",
    roll_no: "",
    roles: ["Guest-User"],
    role: "Guest-User",

    accessibleModules: {},
    currentAccessibleModules: {},

    accessibleModules: {}, // Format---> {role: {module: true}}
    currentAccessibleModules: {}, // Format---> {module: true}
    totalNotifications: 0,

  },
  reducers: {
    setUserName: (state, action) => {
      state.username = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setRollNo: (state, action) => {
      state.roll_no = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setAccessibleModules: (state, action) => {
      state.accessibleModules = action.payload;
    },
    setCurrentAccessibleModules: (state) => {
      state.currentAccessibleModules =
        state.accessibleModules[state.role] || {};
    },
    setTotalNotifications: (state, action) => {
      state.totalNotifications = action.payload;
    },
    clearUserName: (state) => {
      state.username = "User";
    },
    clearRoles: (state) => {
      state.roles = null;
    },
  },
});

export const {
  setUserName,
  setName,
  setRollNo,
  setRoles,
  setRole,
  setAccessibleModules,
  setCurrentAccessibleModules,
  setTotalNotifications,
  clearUserName,
  clearRoles,
} = userSlice.actions;
export default userSlice.reducer;
