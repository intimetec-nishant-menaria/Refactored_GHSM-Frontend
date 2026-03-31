import type { ForgotPasswordInput } from "@/utils/schemas/forgotPassword";
import type { LoginInput } from "@/utils/schemas/login";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ResetPasswordPayload } from "@/utils/interfaces/resetPassword";
import type { User } from "@/utils/interfaces/user";
import type { ChangePasswordPayload } from "@/utils/interfaces/changePassword";
import type { RegisterInput } from "@/utils/schemas/register";
import { removeuser, setUser } from "../slices/auth";

export const authAPi = createApi({
    reducerPath : "authApi",
    baseQuery : fetchBaseQuery({
        baseUrl : `${import.meta.env.VITE_API_BASE_URL}/auth`,
        credentials : "include"
    }),
    tagTypes:["user"],
    endpoints : (builder)=>({
        loginUser : builder.mutation<void , LoginInput>({
            query : (data)=>({
                url : "/login",
                method : "POST",
                body : data
            }),
            invalidatesTags:["user"],
            async onQueryStarted(_ , {dispatch , queryFulfilled}){
                try{
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data?.user ?? null));
                }catch(err){
                    dispatch(removeuser());
                }
            }
        }),
        forgotPassword : builder.mutation<void,ForgotPasswordInput>({
            query : (data)=>({
                url :"/forgetPassword",
                method : "POST",
                body : data
            })
        }),
        resetPassword : builder.mutation<void,ResetPasswordPayload>({
            query : (data)=>({
                url :`/resetPassword?email=${data.email}&token=${data.token}`,
                method:"POST",
                body:data
            })
        }),
        logoutUser : builder.mutation<void,void>({
            query : ()=>({
                url : "/logout",
                method : "POST"
            }),
            invalidatesTags:["user"]
        }),
        getUserDetails : builder.query<User,void>({
            query : ()=>({
                url : "/getUserDetails",
            }),
            providesTags:["user"]
        }),
        changePassword : builder.mutation<void,ChangePasswordPayload>({
            query : (data)=>({
                url : `/changePassword`,
                method : "POST",
                body:data
            })
        }),
        registerUser : builder.mutation<void,RegisterInput>({
            query : (data)=>({
                url :"/register",
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
    useGetUserDetailsQuery
} = authAPi;