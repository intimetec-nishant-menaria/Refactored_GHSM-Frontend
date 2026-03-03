import type { RoomAvailabilityRequest } from "@/utils/interfaces/room";
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiThunk from "./apiThunkHelper";
import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";

export const fetchAvailableRooms = createAsyncThunk(
  "rooms/available",
  async ( data: RoomAvailabilityRequest, { rejectWithValue})=>{
    try{
      return await apiThunk<RoomTypesPayload[]>("/booking/available",{
        method: "POST",
        body : data
      });
    }catch(error){
      if(error instanceof Error) return rejectWithValue(error.message);
      rejectWithValue("Something went wrong");
    }
  }
)