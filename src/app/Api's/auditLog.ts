import type { AuditLogArgs, FetchAuditResponce } from "@/utils/interfaces/auditLog";
import type { paging } from "@/utils/interfaces/paging";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const auditApi = createApi({
    reducerPath : "auditApi",
    baseQuery : fetchBaseQuery({
        baseUrl : `${import.meta.env.VITE_API_BASE_URL}/AuditLog`,
        credentials : "include"
    }),
    tagTypes : ["auditLog"],
    endpoints : (builder)=>({
        fetchAuditLog : builder.query<paging<FetchAuditResponce[]> , AuditLogArgs>({
            query : (data)=>({
                url : `?pageSize=${data.pageSize}&currentPage=${data.currentPage}&entityName=${data.entityName}&id=${data.id}`,
            }),
            providesTags : ["auditLog"]
        }) 
    })
})

export const { useFetchAuditLogQuery } = auditApi;