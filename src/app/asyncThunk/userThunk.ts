import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/utils/interfaces/user";

export const fetchUsers = createAsyncThunk<User[]>(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("https://localhost:7188/api/UserManagement");
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || "Failed to fetch users");
      }
      const data = await res.json();
      return data;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
    }
  },
);
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: number) => {
    const response = await fetch(
      `https://localhost:7188/api/UserManagement/${id}`,
    );
    if (!response.ok) throw new Error("Failed to fetch user");
    return (await response.json()) as User;
  },
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData: CreateUserPayload, { rejectWithValue }) => {
    try {
      const res = await fetch("https://localhost:7188/api/UserManagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message || "Failed to create user");
      }
      return await res.json();
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://localhost:7188/api/UserManagement/${userId}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message || "Failed to delete user");
      }
      return userId;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
    }
  },
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data: UpdateUserPayload, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://localhost:7188/api/UserManagement/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message || "Failed to update user");
      }

      return await res.json();
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Something went wrong");
    }
  },
);
