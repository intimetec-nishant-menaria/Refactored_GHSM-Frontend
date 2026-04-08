import type { RoomSummary } from "@/pages/dashboard/dashBoardCards/cardInterfaces";
import type { paging } from "@/utils/interfaces/paging";
import type { fetchAllRoomArgs, RoomData, UpdateRoomPayload } from "@/utils/interfaces/room";
import type { addRoom } from "@/utils/schemas/addRoom";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from ".";

export const roomAPi = createApi({
    reducerPath : "roomApi",
    baseQuery : baseQueryWithReauth,
    tagTypes : ["room"],
    endpoints : (builder)=>({
        fetchAllRooms : builder.query<paging<RoomData[]> , fetchAllRoomArgs>({
            query : (args)=>({
                url : `/Rooms/getAllRooms?pageNumber=${args.currentPage}&pageSize=${args.pageSize}&roomStatus=${args.roomStatusFilter}&roomNumber=${args.roomNumberFilter}`,
            }),
            providesTags:["room"]
        }),
        deleteRoom : builder.mutation<void,number>({
            query : (id)=>({
                url : `/Rooms/deleteRoom/${id}`,
                method : "DELETE"
            }),
            invalidatesTags : ["room"]
        }),
        addRoom : builder.mutation<void,addRoom>({
            query : (data)=>({
                url : "/Rooms/createRoom",
                method : "POST",
                body : data
            }),
            invalidatesTags : ["room"]
        }),
        updateRoom : builder.mutation<void,UpdateRoomPayload>({
            query : (data)=>({
                url: `/Rooms/updateRoom/${data.id}`,
                method : "PUT",
                body : data
            }),
            invalidatesTags :["room"],
        }),
        roomSummary : builder.query<RoomSummary,void>({
            query : ()=>({
                url : "/Rooms/getSummary",
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