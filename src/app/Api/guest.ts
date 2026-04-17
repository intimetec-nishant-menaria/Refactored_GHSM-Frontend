import type { fetchAllGuestsAgrs, GuestState, UpdateGuest } from "@/utils/interfaces/guest";
import type { paging } from "@/utils/interfaces/paging";
import type { addGuestInput } from "@/utils/schemas/addGuest";
import { createApi} from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from ".";

export const guestApi = createApi({
    reducerPath : "guestApi",
    baseQuery : baseQueryWithReauth,
    tagTypes : ["guest"],
    endpoints : (builder)=>({
        fetchAllGuests : builder.query<paging<GuestState[]>,fetchAllGuestsAgrs>({
            query : (args)=>({
            url: `/getAllGuests?pageNumber=${args.currentPage}&pageSize=${args.pageSize}&searchUser=${args.searchUser}`,
            }),
            providesTags : ["guest"]
        }),
        createGuest : builder.mutation<void,addGuestInput>({
            query : (data)=>({
                url : "/createGuest",
                method : "POST",
                body : data
            }),
            invalidatesTags : ["guest"]
        }),
        updateGuest : builder.mutation<void,UpdateGuest>({
            query : (data)=>({
                url : `/${data.id}/updateGuest`,
                method : "PUT",
                body : data
            }),
            invalidatesTags : ["guest"]
        }),
        searchGuest : builder.query<GuestState[],string>({
            query : (searchGuest)=>({
                url : `/searchGuests?search=${searchGuest}`
            }),
            providesTags : ['guest'],
        }),
        deleteGuest : builder.mutation<void,number>({
            query : (id)=>({
                url : `/${id}/deleteGuest`,
                method : "DELETE"
            }),
            invalidatesTags : ["guest"],
        })
    })
})

export const {
    useFetchAllGuestsQuery,
    useCreateGuestMutation,
    useDeleteGuestMutation,
    useSearchGuestQuery,
    useUpdateGuestMutation
} = guestApi;