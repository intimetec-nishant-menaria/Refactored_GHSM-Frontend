import type { LoginInput } from "@/utils/schemas/loginSchema";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ForgotPasswordInput } from "@/utils/schemas/forgotPasswordSchema";
import type { ResetPasswordPayload } from "@/utils/interfaces/ResetPasswordPayload";
import fetchApi from "@/app/asyncThunk/apiThunkHelper";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: LoginInput, {rejectWithValue }) => {
    try {
      const response = await apiThunk<LoginResponse>("/auth/login", data);
      return response;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Login failed");
    }
  },
);

export const checkMe = createAsyncThunk(
  "auth/checkMe",
  async (_ , {rejectWithValue})=>{
    try{
      const res = await fetch("https://localhost:7188/api/auth/me",{
        method : "GET",
        credentials : "include",
        headers :{
          "Content-Type": "application/json",
        }
      });
      return await res.json();
    }catch(error){
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Login failed");
    }

  }
)

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: ForgotPasswordInput, { rejectWithValue }) => {
    try {
      return await apiThunk("/auth/forgetPassword", data);
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Failed to send reset link");
    }
    return rejectWithValue("Failed to send reset link");
  }
});

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      return await fetchApi("POST", "/auth/resetPassword", {
        email: data.email,
        token: data.token,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Reset failed");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("https://localhost:7188/api/auth/logout",{
        method: "POST", 
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await res.json();
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Logout failed");
    }
  },
);
