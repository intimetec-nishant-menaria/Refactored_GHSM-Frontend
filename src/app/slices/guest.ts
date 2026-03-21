import type { GuestStatePayload } from "@/utils/interfaces/guest";
import { createSlice } from "@reduxjs/toolkit";
import { fetchAllGuest, searchGuest } from "../asyncThunk/guest";

const initialState : GuestStatePayload={
    Guests : [],
    paging : {
        totalCount : 0,
        currentPage : 1,
        pageSize : 10,
        hasNext : false,
        hasPrev : false
    },
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
            state.Guests = action.payload?.data ?? [];
            state.paging = action.payload?.metaData;
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