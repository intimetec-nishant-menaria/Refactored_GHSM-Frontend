import type { RoomAvailabilityRequest } from "@/utils/interfaces/room";
import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const availableRoomApi = createApi({
    reducerPath : "availableRoomApi",
    baseQuery : fetchBaseQuery({
        baseUrl : `${import.meta.env.VITE_API_BASE_URL}/rooms`,
        credentials: "include"
    }),
    tagTypes : ["avaiableRooms"],
    endpoints : (builder)=>({
        getAllAvailableRooms : builder.mutation<RoomTypesPayload[],RoomAvailabilityRequest>({
            query: (data)=>({
                url:"/availability",
                method : "POST",
                body : data,
            }),
            invalidatesTags:["avaiableRooms"]
        })
    })
})

export const { useGetAllAvailableRoomsMutation } = availableRoomApi
