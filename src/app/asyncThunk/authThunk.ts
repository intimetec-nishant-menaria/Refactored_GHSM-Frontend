import type { LoginInput } from "@/utils/schemas/loginSchema";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ForgotPasswordInput } from "@/utils/schemas/forgotPasswordSchema";
import type { ResetPasswordPayload } from "@/utils/interfaces/ResetPasswordPayload";
import apiThunk from "./apiThunkHelper";

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
  async (data: LoginInput, { rejectWithValue }) => {
    try {
      const response = await apiThunk<LoginResponse>("/auth/login", data);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      return response;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Login failed");
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: ForgotPasswordInput, { rejectWithValue }) => {
    try {
      return await apiThunk("/auth/forgetPassword", data);
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Failed to send reset link");
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      return await apiThunk("/auth/resetPassword", data);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Reset failed");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      return await apiThunk("/auth/logout", {});
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Logout failed");
    }
  },
);
