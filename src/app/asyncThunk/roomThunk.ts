import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";
import type { RoomData, UpdateRoomPayload } from "@/utils/interfaces/room";

export const fetchRooms = createAsyncThunk<RoomTypesPayload[]>(
  "room/fetchRooms",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("https://localhost:7188/api/Rooms");
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

export const deleteRoom = createAsyncThunk(
  "room/delete",
  async (roomId: number, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://localhost:7188/api/Rooms/${roomId}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message || "Failed to delete user");
      }
      return roomId;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
    }
  },
);

export const addRoom = createAsyncThunk(
  "user/addRoom",
  async (roomData : RoomData, { rejectWithValue }) => {
    try {
      const res = await fetch("https://localhost:7188/api/Rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData),
      });
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message || "Failed to create user");
      }
      return await res.json();
    } catch (error) {
      // console.log(error.Message);
      if (error instanceof Error) return rejectWithValue(error.message);
    }
  },
);

export const updateRoom = createAsyncThunk(
  "user/updateRoom",
  async (data: UpdateRoomPayload, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://localhost:7188/api/Rooms/${data.id}`,
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
        console.log(err);
        return rejectWithValue(err.message || "Failed to update room");
      }
      return await res.json();
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Something went wrong");
    }
  },
);