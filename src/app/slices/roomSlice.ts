import type { RoomState} from "@/utils/interfaces/roomTypes";
import { createSlice } from "@reduxjs/toolkit";
import { deleteRoom, fetchRooms } from "../asyncThunk/roomThunk";

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
        state.rooms = action.payload.sort((a,b)=>(Number(a.roomNumber)-Number(b.roomNumber)));
        state.loading = false;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      builder.addCase(deleteRoom.fulfilled , (state , action)=>{
        state.rooms = state.rooms.filter( room => room.id !=action.payload);
      });
  },
});

export default RoomSlice.reducer;
