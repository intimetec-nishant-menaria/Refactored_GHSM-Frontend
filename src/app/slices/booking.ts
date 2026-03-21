import type { BookingState } from "@/utils/interfaces/booking";
import { createSlice } from "@reduxjs/toolkit";
import { fetchAllBookings, fetchBookingsByRange, fetchUserBookings } from "../asyncThunk/booking";

const initialState: BookingState = {
  bookings: [],
  paging : {
    totalCount : 0,
    currentPage : 1,
    pageSize : 10,
    hasNext : false,
    hasPrev : false
  },
  loading: false,
  error: null,
};

const BookingSlice = createSlice({
    name : "bookingSlice",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchAllBookings.pending , (state)=>{
            state.loading = true;
        }).addCase(fetchAllBookings.fulfilled , (state,action)=>{
            state.bookings = action.payload?.data ?? [];
            state.paging = action.payload?.metaData;
            state.loading = false;
        }).addCase(fetchAllBookings.rejected , (state , action)=>{
            state.loading=false;
            state.error = action.payload as string;
        })

        builder.addCase(fetchBookingsByRange.pending , (state)=>{
            state.loading = true;
        }).addCase(fetchBookingsByRange.fulfilled , (state,action)=>{
            state.bookings = action.payload ?? [];
            state.loading = false;
        }).addCase(fetchBookingsByRange.rejected , (state , action)=>{
            state.loading=false;
            state.error = action.payload as string;
        })

        builder.addCase(fetchUserBookings.pending , (state)=>{
            state.loading = true;
        }).addCase(fetchUserBookings.fulfilled , (state,action)=>{
            state.bookings = action.payload?.data ?? [];
            state.paging = action.payload?.metaData;
            state.loading = false;
        }).addCase(fetchUserBookings.rejected , (state , action)=>{
            state.loading=false;
            state.error = action.payload as string;
        })
    }
})

export default BookingSlice.reducer;
