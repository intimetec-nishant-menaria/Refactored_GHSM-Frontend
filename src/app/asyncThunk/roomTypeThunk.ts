import type { RoomType } from "@/utils/interfaces/roomTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRoomType = createAsyncThunk<RoomType[]>(
    "roomType/fetchRoomType",
    async ( _ , { rejectWithValue } )=>{
        try{
            const res = await fetch("https://localhost:7188/api/roomtypes");
            if(!res.ok){
                const error = await res.json();
                return rejectWithValue(error.message || "Failed to fetch Rooms");
            }
            return await res.json();
        }catch(error){
            if (error instanceof Error) return rejectWithValue(error.message);
        }
    },
);