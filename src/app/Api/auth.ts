import type { ForgotPasswordInput } from "@/utils/schemas/forgotPassword";
import type { LoginInput } from "@/utils/schemas/login";
import { createApi  } from "@reduxjs/toolkit/query/react";
import type { ResetPasswordPayload } from "@/utils/interfaces/resetPassword";
import type { User } from "@/utils/interfaces/user";
import type { ChangePasswordPayload } from "@/utils/interfaces/changePassword";
import type { RegisterInput } from "@/utils/schemas/register";
import { logOut, setCredentials } from "../slices/auth";
import type { LoginResponce } from "@/utils/interfaces/authLayout";
import baseQueryWithReauth from ".";

export const authAPi = createApi({
    reducerPath : "authApi",
    baseQuery : baseQueryWithReauth,
    tagTypes:["user"],
    endpoints : (builder)=>({
        loginUser : builder.mutation<LoginResponce , LoginInput>({
            query : (data)=>({
                url : "/auth/login",
                method : "POST",
                body : data
            }),
            invalidatesTags:["user"],
            async onQueryStarted(_ , {dispatch , queryFulfilled}){
                try{
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                }catch(err){
                    dispatch(logOut());
                }
            }
        }),
        refresh : builder.mutation<{ accessToken: string, user: User }, void>({
            query : ()=>({
                url : "/auth/refresh",
                method : "POST",
            }),
            invalidatesTags:["user"],
            async onQueryStarted(_ , {dispatch , queryFulfilled}){
                try{
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                }catch(err){
                    dispatch(logOut());
                }
            }
        }),
        forgotPassword : builder.mutation<void,ForgotPasswordInput>({
            query : (data)=>({
                url :"/auth/forgetPassword",
                method : "POST",
                body : data
            })
        }),
        resetPassword : builder.mutation<void,ResetPasswordPayload>({
            query : (data)=>({
                url :`/auth/resetPassword?email=${data.email}&token=${data.token}`,
                method:"POST",
                body:data
            })
        }),
        logoutUser : builder.mutation<void,void>({
            query : ()=>({
                url : "/auth/logout",
                method : "POST"
            }),
            invalidatesTags:["user"]
        }),
        getUserDetails : builder.query<User,void>({
            query : ()=>({
                url : "/auth/getUserDetails",
            }),
            providesTags:["user"]
        }),
        changePassword : builder.mutation<void,ChangePasswordPayload>({
            query : (data)=>({
                url : `/auth/changePassword`,
                method : "POST",
                body:data
            })
        }),
        registerUser : builder.mutation<void,RegisterInput>({
            query : (data)=>({
                url :"/auth/register",
                method : "POST",
                body : data
            })
        })
    })
})

export const {
    useLoginUserMutation,
    useLogoutUserMutation,
    useChangePasswordMutation,
    useForgotPasswordMutation,
    useRegisterUserMutation,
    useResetPasswordMutation,
    useGetUserDetailsQuery,
    useRefreshMutation
} = authAPi;