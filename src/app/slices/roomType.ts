import type { RoomTypeState } from "@/utils/interfaces/roomTypes";
import { createSlice } from "@reduxjs/toolkit";
import { fetchRoomType } from "../asyncThunk/roomType";

const initialState: RoomTypeState = {
  roomTypes: [],
  loading: false,
  error: null,
};

const roomTypeSlice = createSlice({
  name: "roomType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomType.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoomType.fulfilled, (state, action) => {
        state.roomTypes = action.payload;
        state.loading = false;
      })
      .addCase(fetchRoomType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default roomTypeSlice.reducer;
