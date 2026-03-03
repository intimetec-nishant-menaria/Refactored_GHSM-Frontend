import type { BookingState } from "@/utils/interfaces/booking";
import { createSlice } from "@reduxjs/toolkit";
import { fetchAllBookings } from "../asyncThunk/bookingThunk";

const initialState:BookingState ={
    bookings :[],
    loading : false,
    error : null,
}

const BookingSlice = createSlice({
    name : "bookingSlice",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchAllBookings.pending , (state)=>{
            state.loading = true;
        }).addCase(fetchAllBookings.fulfilled , (state,action)=>{
            state.bookings = action.payload ?? [];
            state.loading = false;
        }).addCase(fetchAllBookings.rejected , (state , action)=>{
            state.loading=false;
            state.error = action.payload as string;
        })
    }
})

export default BookingSlice.reducer;