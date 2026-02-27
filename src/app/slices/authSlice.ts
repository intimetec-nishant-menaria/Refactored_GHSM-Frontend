import type { AuthState } from "@/utils/interfaces/authLayout";
import { createSlice } from "@reduxjs/toolkit";
import { forgotPassword } from "../asyncThunk/authThunk";
import { checkMe } from "../asyncThunk/authThunk";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  extraReducers : (builder)=>{
    builder.addCase(checkMe.pending , (state)=>{
      state.loading = true;
    }).addCase(checkMe.fulfilled , (state , action)=>{
      state.user = action.payload;
      state.loading = false;
    }).addCase(checkMe.rejected , (state ,action)=>{
      state.loading = false;
      state.error = action.error as string;
    })
  }
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
