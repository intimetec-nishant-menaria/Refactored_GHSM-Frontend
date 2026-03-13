import { createAsyncThunk } from "@reduxjs/toolkit";
import apiThunk from "./apiThunkHelper";
import type {
  CreateBookingPayload,
  updateBookingPayload,
} from "@/utils/interfaces/booking";
import type { ManualBookingData } from "@/utils/schemas/manualBookingSchema";

interface fetchBookingsArgs {
  startDate: string;
  endDate: string;
}

export const createBooking = createAsyncThunk(
  "api/createBooking",
  async (data: CreateBookingPayload, { rejectWithValue }) => {
    try {
      return await apiThunk("/booking/createBooking", {
        method: "POST",
        body: data,
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      rejectWithValue("something went wrong");
    }
  },
);

export const createManualBooking = createAsyncThunk(
  "api/createBooking",
  async (data: ManualBookingData, { rejectWithValue }) => {
    try {
      return await apiThunk("/booking/createBooking", {
        method: "POST",
        body: data,
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      rejectWithValue("something went wrong");
    }
  },
);

export const fetchAllBookings = createAsyncThunk(
  "api/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      return await apiThunk("/booking/getAllBookings");
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      rejectWithValue("something went wrong");
    }
  },
);

export const cancelBooking = createAsyncThunk(
  "api/cancelBookings",
  async (id: number, { rejectWithValue }) => {
    try {
      return await apiThunk(`/booking/${id}/cancelBooking`, {
        method: "POST",
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      console.log(error);
      rejectWithValue("something went wrong");
    }
  },
);

export const fetchBookingsByRange = createAsyncThunk(
  "api/fetchBookingsByRange",
  async (dates: fetchBookingsArgs, { rejectWithValue }) => {
    try {
      return await apiThunk(
        `/booking/getBookingsByRange?start=${dates.startDate}&end=${dates.endDate}`,
      );
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      rejectWithValue("something went wrong");
    }
  },
);

export const updateBooking = createAsyncThunk(
  "api/updateBooking",
  async (data: updateBookingPayload, { rejectWithValue }) => {
    try {
      return await apiThunk(`/booking/updateBooking/${data.id}`, {
        method: "PUT",
        body: data,
      });
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("something went wrong");
    }
    }
)

export const checkIn = createAsyncThunk(
    "api/updateBooking",
    async ( bookingId : number, {rejectWithValue})=>{
        try{
            return await apiThunk(`/booking/checkIn/${bookingId}`,{
                method : "POST",
                body : bookingId
            });
        }catch(error){
            if(error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue("something went wrong");
        }
    }
)

export const checkOut = createAsyncThunk(
    "api/updateBooking",
    async ( bookingId: number , {rejectWithValue})=>{
        try{
            return await apiThunk(`/booking/checkOut/${bookingId}`,{
                method : "POST",
                body : bookingId
            });
        }catch(error){
            if(error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue("something went wrong");
        }
    }
)