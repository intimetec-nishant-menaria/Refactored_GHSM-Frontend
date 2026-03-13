import type { GuestStatePayload } from "@/utils/interfaces/guest";
import { createSlice } from "@reduxjs/toolkit";
import { fetchAllGuest, searchGuest } from "../asyncThunk/guestThunk";

const initialState : GuestStatePayload={
    Guests : [],
    loading : false,
    error : null
}

const guestSlice = createSlice({
    name : "guest",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchAllGuest.pending ,(state)=>{
            state.loading =true;
        }).addCase(fetchAllGuest.fulfilled , (state , action)=>{
            state.loading = false;
            state.Guests = action.payload ?? [];
        }).addCase(fetchAllGuest.rejected , (state,action)=>{
            state.loading = false;
            state.error = action.error.message as string;
        })

        builder.addCase(searchGuest.pending ,(state)=>{
            state.loading =true;
        }).addCase(searchGuest.fulfilled , (state , action)=>{
            state.loading = false;
            state.Guests = action.payload ?? [];
        }).addCase(searchGuest.rejected , (state,action)=>{
            state.loading = false;
            state.error = action.error.message as string;
        })
    }
})

export default guestSlice.reducer;