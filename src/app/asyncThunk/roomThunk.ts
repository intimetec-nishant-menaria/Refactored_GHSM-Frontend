import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";
import type { RoomData, UpdateRoomPayload } from "@/utils/interfaces/room";
import apiThunk from "./apiThunkHelper";

export const fetchRooms = createAsyncThunk<RoomTypesPayload[]>(
  "room/fetchRooms",
  async (_, { rejectWithValue }) => {
    try {
      return await apiThunk("/Rooms/getAllRooms");
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("something went wrong");
    }
  },
);

export const deleteRoom = createAsyncThunk(
  "room/delete",
  async (roomId: number, { rejectWithValue }) => {
    try {
      return await apiThunk(`/Rooms/deleteRoom/${roomId}`, {
        method: "DELETE",
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
    }
  },
);

export const addRoom = createAsyncThunk(
  "user/addRoom",
  async (roomData: RoomData, { rejectWithValue }) => {
    try {
      return await apiThunk("/Rooms/createRoom", {
        method: "POST",
        body: roomData,
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
    }
  },
);

export const updateRoom = createAsyncThunk(
  "user/updateRoom",
  async (data: UpdateRoomPayload, { rejectWithValue }) => {
    try {
      return await apiThunk(`/Rooms/updateRoom/${data.id}`, {
        method: "PUT",
        body: data,
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Something went wrong");
    }
  },
);
