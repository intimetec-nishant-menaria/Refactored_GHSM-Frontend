import type { paging } from "@/utils/interfaces/paging";
import type { CreateUserPayload, fetchUsersArgs, UpdateUserPayload, User } from "@/utils/interfaces/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const userApi = createApi({
    reducerPath : "userAPi",
    baseQuery : fetchBaseQuery({
        baseUrl : `${import.meta.env.VITE_API_BASE_URL}/UserManagement`,
        credentials : "include",
    }),
    tagTypes : ["user"],
    endpoints: (builder)=>({
        fetchAllUsers : builder.query<paging<User[]>,fetchUsersArgs>({
            query:(data)=>({
                url : `/getAllUsers?pageNumber=${data.currentPage}&pageSize=${data.pageSize}&searchUser=${data.searchUser}`
            }),
            providesTags : ["user"]
        }),
        createUser : builder.mutation<void,CreateUserPayload>({
            query : (data)=>({
                url : "/createUser",
                method : "POST",
                body : data 
            }),
            invalidatesTags : ["user"]
        }),
        deleteUser : builder.mutation<void,number>({
            query : (id)=>({
                url : `/${id}/deleteUser`,
                method: "DELETE",
            }),
            invalidatesTags : ["user"],
        }),
        updateUser : builder.mutation<void , UpdateUserPayload>({
            query : (data)=>({
                url : `/${data.id}/updateUser`,
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