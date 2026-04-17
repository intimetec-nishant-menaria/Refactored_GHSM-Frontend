import type { RoomAvailabilityRequest, RoomData } from "@/utils/interfaces/room";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "./index";

export const availableRoomApi = createApi({
  reducerPath: "availableRoomApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["availableRooms"], 
  endpoints: (builder) => ({
    getAllAvailableRooms: builder.query<RoomData[], RoomAvailabilityRequest>({
      query: (data) => ({
        url: '/rooms/availability',
        method: "GET",
        params: {
          gender: data.gender,
          checkIn: data.checkIn,
          checkOut: data.checkOut
        }
      }),
      providesTags: ["availableRooms"],
    })
  })
})

export const { useLazyGetAllAvailableRoomsQuery , useGetAllAvailableRoomsQuery } = availableRoomApi
