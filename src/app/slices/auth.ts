import type { AuthState } from "@/utils/interfaces/authLayout";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser : (state,action)=>{
      state.user = action.payload;
    },
    removeuser : (state)=>{
      state.user = null;
    }
  },
});

export const {setUser , removeuser} = authSlice.actions;
export default authSlice.reducer;