import type { LoginInput } from "@/utils/schemas/login";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ForgotPasswordInput } from "@/utils/schemas/forgotPassword";
import type { ResetPasswordPayload } from "@/utils/interfaces/resetPassword";
import apiThunk from ".";
import type { User } from "@/utils/interfaces/user";
import type { ChangePasswordPayload } from "@/utils/interfaces/changePassword";
import type { RegisterInput } from "@/utils/schemas/register";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: number;
    isActive: boolean;
  };
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: LoginInput, { rejectWithValue }) => {
    try {
      await apiThunk<LoginResponse>("/auth/login", {
        method: "POST",
        body: data,
      });

      const response = await apiThunk<User>("/auth/getUserDetails");
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
      return await apiThunk("/auth/forgetPassword", {
        method: "POST",
        body: data,
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Failed to send reset link");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      return await apiThunk(`/auth/resetPassword?email=${data.email}&token=${data.token}`, {
        method: "POST",
        body: data,
      });
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
      return await apiThunk("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Logout failed");
    }
  },
);

export const checkMe = createAsyncThunk(
  "auth/checkMe",
  async (_, { rejectWithValue }) => {
    try {
      return await apiThunk<User>("/auth/getUserDetails");
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Logout failed");
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data: ChangePasswordPayload, { rejectWithValue }) => {
    try {
      return await apiThunk("/auth/changePassword", {
        method: "POST",
        body: data,
      });
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Change Password failed");
    }
  },
);

export const registerUser = createAsyncThunk(
  "/api/register",
  async( data : RegisterInput , {rejectWithValue})=>{
    try{
      return await apiThunk("/auth/register",{
        method: "POST",
        body : data
      } )
    }catch(error){
      if(error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("something went wrong");
    }
  }
)
