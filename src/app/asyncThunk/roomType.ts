import type { RoomType } from "@/utils/interfaces/roomTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiThunk from ".";

export const fetchRoomType = createAsyncThunk<RoomType[]>(
  "roomType/fetchRoomType",
  async (_, { rejectWithValue }) => {
    try {
      return await apiThunk("/roomtypes");
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Something went wrong");
    }
  },
);
