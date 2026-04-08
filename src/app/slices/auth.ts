import type { AuthState } from "@/utils/interfaces/authLayout";
import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user");

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token : localStorage.getItem("accessToken") ?? null,
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials : (state,action)=>{
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logOut : (state)=>{
      state.user = null;
      state.token=null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  },
});

export const {setCredentials , logOut} = authSlice.actions;
export default authSlice.reducer;