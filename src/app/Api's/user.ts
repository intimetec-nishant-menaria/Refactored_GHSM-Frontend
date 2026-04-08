import type { paging } from "@/utils/interfaces/paging";
import type { CreateUserPayload, fetchUsersArgs, UpdateUserPayload, User } from "@/utils/interfaces/user";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from ".";


export const userApi = createApi({
    reducerPath : "userAPi",
    baseQuery : baseQueryWithReauth,
    tagTypes : ["user"],
    endpoints: (builder)=>({
        fetchAllUsers : builder.query<paging<User[]>,fetchUsersArgs>({
            query:(data)=>({
                url : `/UserManagement/getAllUsers?pageNumber=${data.currentPage}&pageSize=${data.pageSize}&searchUser=${data.searchUser}`
            }),
            providesTags : ["user"]
        }),
        createUser : builder.mutation<void,CreateUserPayload>({
            query : (data)=>({
                url : "/UserManagement/createUser",
                method : "POST",
                body : data 
            }),
            invalidatesTags : ["user"]
        }),
        deleteUser : builder.mutation<void,number>({
            query : (id)=>({
                url : `/UserManagement/${id}/deleteUser`,
                method: "DELETE",
            }),
            invalidatesTags : ["user"],
        }),
        updateUser : builder.mutation<void , UpdateUserPayload>({
            query : (data)=>({
                url : `/UserManagement/${data.id}/updateUser`,
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