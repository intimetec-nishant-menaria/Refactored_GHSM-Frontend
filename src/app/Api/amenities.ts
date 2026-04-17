import type { Amenity } from "@/utils/interfaces/amenity";
import { createApi  } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from ".";

export const amenitiesApi = createApi({
    reducerPath : "amenitiesApi",
    baseQuery : baseQueryWithReauth,
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