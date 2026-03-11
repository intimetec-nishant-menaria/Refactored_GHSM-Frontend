import type { LoginInput } from "@/utils/schemas/loginSchema";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ForgotPasswordInput } from "@/utils/schemas/forgotPasswordSchema";
import type { ResetPasswordPayload } from "@/utils/interfaces/ResetPasswordPayload";
import fetchApi from "@/app/asyncThunk/apiThunkHelper";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: LoginInput, { rejectWithValue }) => {
    try {
      return await fetchApi("POST", "/auth/login", data, {
        withCredentials: true,
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Login failed");
    }
  },
);

export const forgotPassword = createAsyncThunk<
  string,
  ForgotPasswordInput,
  { rejectValue: string }
>("auth/forgotPassword", async (data, { rejectWithValue }) => {
  try {
    return await fetchApi<string>("POST", "/auth/forgetPassword", data);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
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
