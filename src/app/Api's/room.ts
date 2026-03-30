import type { RoomSummary } from "@/pages/dashboard/dashBoardCards/cardInterfaces";
import type { paging } from "@/utils/interfaces/paging";
import type { fetchAllRoomArgs, RoomData, UpdateRoomPayload } from "@/utils/interfaces/room";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roomAPi = createApi({
    reducerPath : "roomApi",
    baseQuery : fetchBaseQuery({
        baseUrl : `${import.meta.env.VITE_API_BASE_URL}/Rooms`,
        credentials : "include"
    }),
    tagTypes : ["room"],
    endpoints : (builder)=>({
        fetchAllRooms : builder.query<paging<RoomData[]> , fetchAllRoomArgs>({
            query : (args)=>({
                url : `/getAllRooms?pageNumber=${args.currentPage}&pageSize=${args.pageSize}&roomStatus=${args.roomStatusFilter}&roomNumber=${args.roomNumberFilter}`,
            }),
            providesTags:["room"]
        }),
        deleteRoom : builder.mutation<void,number>({
            query : (id)=>({
                url : `/deleteRoom/${id}`,
                method : "DELETE"
            }),
            invalidatesTags : ["room"]
        }),
        addRoom : builder.mutation<void,RoomData>({
            query : (data)=>({
                url : "/createRoom",
                method : "POST",
                body : data
            }),
            invalidatesTags : ["room"]
        }),
        updateRoom : builder.mutation<void,UpdateRoomPayload>({
            query : (data)=>({
                url: `/updateRoom/${data.id}`,
                method : "PUT",
                body : data
            }),
            invalidatesTags :["room"],
        }),
        roomSummary : builder.query<RoomSummary,void>({
            query : ()=>({
                url : "/getSummary",
            }),
            providesTags : ["room"],
        })
    })
})

export const { 
    useFetchAllRoomsQuery,
    useAddRoomMutation,
    useDeleteRoomMutation,
    useUpdateRoomMutation,
    useRoomSummaryQuery
} = roomAPi; 