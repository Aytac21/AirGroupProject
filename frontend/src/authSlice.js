import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
    message: "",
  },
  reducers: {
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
    clearMessage(state) {
      state.message = "";
    },
  },
});

export const { loginSuccess, logout, setMessage, clearMessage } =
  authSlice.actions;
export default authSlice.reducer;
