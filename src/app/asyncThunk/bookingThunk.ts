import { createAsyncThunk } from "@reduxjs/toolkit";
import apiThunk from "./apiThunkHelper";
import type { CreateBookingPayload } from "@/utils/interfaces/booking";

export const createBooking = createAsyncThunk(
    "api/createBooking",
    async (data:CreateBookingPayload , {rejectWithValue})=>{
        try{
            return await apiThunk("/booking",{
                method: "POST",
                body:data
            })
        }catch(error){
            if(error instanceof Error)  return rejectWithValue(error.message);
            rejectWithValue("something went wrong");
        }
    }
)

export const fetchAllBookings = createAsyncThunk(
    "api/fetchBookings",
    async (_ , { rejectWithValue })=>{
        try{
            return await apiThunk("/booking");
        }catch(error){
            if(error instanceof Error) return rejectWithValue(error.message);
            rejectWithValue("something went wrong");
        }
    }
)

export const cancelBooking = createAsyncThunk(
    "api/cacelBookings",
    async (id : number , { rejectWithValue })=>{
        try{
            return await apiThunk(`/booking/${id}/cancel`,{
                method: "POST"
            });
        }catch(error){
            if(error instanceof Error) return rejectWithValue(error.message);
            rejectWithValue("something went wrong");
        }
    }
)

