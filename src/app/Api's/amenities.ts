import type { Amenity } from "@/utils/interfaces/amenity";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const amenitiesApi = createApi({
    reducerPath : "amenitiesApi",
    baseQuery : fetchBaseQuery({
        baseUrl : `${import.meta.env.VITE_API_BASE_URL}/roomtypes`,
        credentials : "include"
    }),
    tagTypes : ["amenities"],
    endpoints : (builder)=>({
        fetchAllAmenities: builder.query<Amenity[] , void>({
            query : ()=>({
                url : "/amenities"
            }),
            providesTags:["amenities"],
        })
    })
})

export const { useFetchAllAmenitiesQuery } = amenitiesApi;