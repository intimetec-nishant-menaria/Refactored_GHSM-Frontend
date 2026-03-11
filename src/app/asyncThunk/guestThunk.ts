import { createAsyncThunk } from "@reduxjs/toolkit";
import apiThunk from "./apiThunkHelper";
import type { GuestState, UpdateGuest } from "@/utils/interfaces/guest";
import type { addGuestInput } from "@/utils/schemas/addGuestSchema";

export const fetchAllGuest = createAsyncThunk(
    "api/fetchAllGuests",
    async(_ , {rejectWithValue})=>{
        try{
            return await apiThunk<GuestState[]>("/guest");
        }catch(error){
            if(error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue("Something went wrrong");
        }
    }
)

export const createGuest = createAsyncThunk(
    "api/fetchAllGuests",
    async(data: addGuestInput , {rejectWithValue})=>{
        try{
            return await apiThunk("/guest",{
                method: "POST",
                body:data
            });
        }catch(error){
            if(error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue("Something went wrrong");
        }
    }
)