import type { RoomState } from "@/utils/interfaces/roomTypes";
import { createSlice } from "@reduxjs/toolkit";
import { fetchRooms } from "../asyncThunk/roomThunk";

const initialState: RoomState = {
  rooms: [],
  loading: false,
  error: null,
};

const RoomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default RoomSlice.reducer;
