import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userslice";
import moduleReducer from "./moduleslice";
import intendReducer from "./purchase/purchaseSlice";
import archiveReducer from "./purchase/archivedSlice";
import inboxReducer from "./purchase/inboxSlice";
import outboxReducer from "./purchase/outboxSlice";
import savedIndentReducer from "./purchase/savedIndentsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    module: moduleReducer,
    indent: intendReducer,
    archieve: archiveReducer,
    inbox: inboxReducer,
    outbox: outboxReducer,
    savedIndent: savedIndentReducer,
  },
});
