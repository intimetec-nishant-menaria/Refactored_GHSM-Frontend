import type { AuditLogArgs, FetchAuditResponce } from "@/utils/interfaces/auditLog";
import type { paging } from "@/utils/interfaces/paging";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from ".";

export const auditApi = createApi({
    reducerPath : "auditApi",
    baseQuery : baseQueryWithReauth,
    tagTypes : ["auditLog"],
    endpoints : (builder)=>({
        fetchAuditLog : builder.query<paging<FetchAuditResponce[]> , AuditLogArgs>({
            query : (data)=>({
                url : `/AuditLog?pageSize=${data.pageSize}&currentPage=${data.currentPage}&entityName=${data.entityName}&id=${data.id}`,
            }),
            providesTags : ["auditLog"]
        }) 
    })
})

export const { useFetchAuditLogQuery } = auditApi;