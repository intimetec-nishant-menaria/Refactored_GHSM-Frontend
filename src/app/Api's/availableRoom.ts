import type { RoomAvailabilityRequest, RoomData } from "@/utils/interfaces/room";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const availableRoomApi = createApi({
    reducerPath : "availableRoomApi",
    baseQuery : fetchBaseQuery({
        baseUrl : `${import.meta.env.VITE_API_BASE_URL}/rooms`,
        credentials: "include"
    }),
    tagTypes : ["avaiableRooms"],
    endpoints : (builder)=>({
        getAllAvailableRooms : builder.query<RoomData[],RoomAvailabilityRequest>({
            query: (data)=>({
                url:`/availability?gender=${data.gender}&checkIn=${data.checkIn}&checkOut=${data.checkOut}`,
                method : "GET"
            }),
            providesTags : ["avaiableRooms"],
        })
    })
})

export const { useLazyGetAllAvailableRoomsQuery , useGetAllAvailableRoomsQuery } = availableRoomApi
