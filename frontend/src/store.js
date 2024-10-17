import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
const devTools = process.env.NODE_ENV !== "production";

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
