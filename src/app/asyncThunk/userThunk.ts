import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/utils/interfaces/user";
import apiThunk from "./apiThunkHelper";

export const fetchUsers = createAsyncThunk<User[]>(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await apiThunk<User[]>("/UserManagement/getAllUsers");
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("something went wrong");
    }
  },
);
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: number) => {
    return await apiThunk(`/UserManagement/getUserById/${id}`);
  },
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData: CreateUserPayload, { rejectWithValue }) => {
    try {
      return await apiThunk("/UserManagement/createUser", {
        method: "POST",
        body: userData,
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      return await apiThunk(`/UserManagement/${userId}/deleteUser`, {
        method: "DELETE",
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("something went wrong");
    }
  },
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data: UpdateUserPayload, { rejectWithValue }) => {
    try {
      return await apiThunk(`/UserManagement/${data.id}/updateUser`, {
        method: "PUT",
        body: data,
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Something went wrong");
    }
  },
);
