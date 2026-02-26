import type { LoginInput } from "@/utils/schemas/loginSchema";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ForgotPasswordInput } from "@/utils/schemas/forgotPasswordSchema";
import type { ResetPasswordPayload } from "@/utils/interfaces/resetPassword";
import apiThunk from "./apiThunkHelper";
import type { User } from "@/utils/interfaces/user";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name : string;
    email: string;
    role: number;
    isActive : boolean;
  };
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name : string;
    email: string;
    role: number;
    isActive : boolean;
  };
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name : string;
    email: string;
    role: number;
    isActive : boolean;
  };
}

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
      await apiThunk<LoginResponse>("/auth/login", {
        method : "POST",
        body : data,
      });
      
      const response = await apiThunk<User>("/auth/me");
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
        method : "POST",
        body : data
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Failed to send reset link");
    }
    return rejectWithValue("Failed to send reset link");
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      return await apiThunk("/auth/resetPassword", {
        method : "POST",
        body : data
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
      return await apiThunk("/auth/logout",{
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
  async ( _ , {rejectWithValue} )=>{
    try{
      return await apiThunk<User>("/auth/me");
    }catch(error){
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Logout failed");
    }
  }
)
