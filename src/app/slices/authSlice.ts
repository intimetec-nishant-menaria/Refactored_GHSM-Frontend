import type { AuthState } from "@/utils/interfaces/authLayout";
import { createSlice } from "@reduxjs/toolkit";
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
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
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
