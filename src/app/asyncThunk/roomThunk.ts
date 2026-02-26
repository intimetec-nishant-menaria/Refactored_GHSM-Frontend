import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";

export const fetchRooms = createAsyncThunk<RoomTypesPayload[]>(
  "room/fetchRooms",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("https://localhost:7188/api/RoomTypes/");
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || "Failed to fetch Rooms");
      }
      const data = await res.json();
      return data;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
    }
  },
);
