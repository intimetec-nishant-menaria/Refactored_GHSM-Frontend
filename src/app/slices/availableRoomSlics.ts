import type { RoomState} from "@/utils/interfaces/roomTypes";
import { createSlice } from "@reduxjs/toolkit";
import {  fetchAvailableRooms} from "../asyncThunk/availableRoomThunk";

const initialState: RoomState = {
  rooms: [],
  loading: false,
  error: null,
};

const AvailableRoomSlice = createSlice({
  name: "availableRoom",
  initialState,
  reducers: {},
  extraReducers: (builder) => {;

      builder
      .addCase(fetchAvailableRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableRooms.fulfilled, (state, action) => {
        state.rooms = action.payload?.sort((a,b)=>(Number(a.roomNumber)-Number(b.roomNumber))) ?? [] ;
        state.loading = false;
      })
      .addCase(fetchAvailableRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default AvailableRoomSlice.reducer;
