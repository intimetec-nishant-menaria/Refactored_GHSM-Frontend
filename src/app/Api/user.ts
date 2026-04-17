import type { paging } from "@/utils/interfaces/paging";
import type { CreateUserPayload, fetchUsersArgs, UpdateUserPayload, User } from "@/utils/interfaces/user";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from ".";


export const userApi = createApi({
    reducerPath : "userApi",
    baseQuery : baseQueryWithReauth,
    tagTypes : ["user"],
    endpoints: (builder)=>({
        fetchAllUsers : builder.query<paging<User[]>,fetchUsersArgs>({
            query:(data)=>({
                url : `/User?pageNumber=${data.currentPage}&pageSize=${data.pageSize}&searchUser=${data.searchUser}`
            }),
            providesTags : ["user"]
        }),
        createUser : builder.mutation<void,CreateUserPayload>({
            query : (data)=>({
                url : "/User",
                method : "POST",
                body : data 
            }),
            invalidatesTags : ["user"]
        }),
        deleteUser : builder.mutation<void,number>({
            query : (id)=>({
                url : `/User/${id}`,
                method: "DELETE",
            }),
            invalidatesTags : ["user"],
        }),
        updateUser : builder.mutation<void , UpdateUserPayload>({
            query : (data)=>({
                url : `/User/${data.id}`,
                method : "PUT",
                body : data
            }),
            invalidatesTags : ["user"]
        })
    })
})

export const {
    useFetchAllUsersQuery,
    useCreateUserMutation,
    useDeleteUserMutation,
    useUpdateUserMutation,
} = userApi;