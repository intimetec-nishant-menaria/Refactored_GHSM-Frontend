import type { RoomType } from "@/utils/interfaces/roomTypes";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from ".";

export const roomTypeApi  = createApi({
    reducerPath : "roomTypeApi",
    baseQuery : baseQueryWithReauth,
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