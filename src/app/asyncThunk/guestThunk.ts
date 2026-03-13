import { createAsyncThunk } from "@reduxjs/toolkit";
import apiThunk from "./apiThunkHelper";
import type { GuestState, UpdateGuest } from "@/utils/interfaces/guest";
import type { addGuestInput } from "@/utils/schemas/addGuestSchema";

export const fetchAllGuest = createAsyncThunk(
    "api/fetchAllGuests",
    async(_ , {rejectWithValue})=>{
        try{
            return await apiThunk<GuestState[]>("/guest/getAllGuests");
        }catch(error){
            if(error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue("Something went wrrong");
        }
    }
)

export const createGuest = createAsyncThunk(
    "api/addGuests",
    async(data: addGuestInput , {rejectWithValue})=>{
        try{
            return await apiThunk("/guest/createGuest",{
                method: "POST",
                body:data
            });
        }catch(error){
            if(error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue("Something went wrrong");
        }
    }
)

export const updateGuest = createAsyncThunk(
    "api/updateGuests",
    async(data: UpdateGuest , {rejectWithValue})=>{
        try{
            return await apiThunk(`/guest/${data.id}/updateGuest`,{
                method: "PUT",
                body:data
            });
        }catch(error){
            if(error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue("Something went wrrong");
        }
    }
)

export const searchGuest = createAsyncThunk(
    "api/searchguest",
    async ( data : string , {rejectWithValue})=>{
        try{
            return await apiThunk<GuestState[]>(`/guest/searchGuests?search=${data}`,{
                method:"GET",
            });
        }catch(error){
            if(error instanceof Error)  return rejectWithValue(error.message);
            return rejectWithValue("something went wrong");
        }
    }
)

export const deleteGuest = createAsyncThunk(
    "api/deleteGuest",
    async(id:number , {rejectWithValue})=>{
        try{
            return await apiThunk(`/guest/${id}/deleteGuest`,{
                method: "DELETE"
            });
        }catch(error){
            if(error instanceof Error)return rejectWithValue(error.message);
            rejectWithValue(error);
        }
    }
)