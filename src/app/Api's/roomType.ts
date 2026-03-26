import type { RoomType } from "@/utils/interfaces/roomTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roomTypeApi  = createApi({
    reducerPath : "roomTypeApi",
    baseQuery : fetchBaseQuery({
        baseUrl : `${import.meta.env.VITE_API_BASE_URL}`,
        credentials : "include"
    }),
    tagTypes : ["roomType"],
    endpoints : (builder)=>({
        fetchAllRoomTypes : builder.query<RoomType[],void>({
            query : ()=>({
                url : "/roomtypes",
            }),
            providesTags : ['roomType']
        })
    })
})

export const { useFetchAllRoomTypesQuery } = roomTypeApi; 