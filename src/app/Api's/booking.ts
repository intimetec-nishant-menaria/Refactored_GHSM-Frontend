import type { BookingPayload, fetchBookingArgs, fetchBookingsByRangeArgs, fetchUserBookingArgs } from "@/utils/interfaces/booking";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { paging } from "@/utils/interfaces/paging";
import type { BookingInput } from "@/utils/schemas/addBookings";
import  { HubConnectionBuilder } from "@microsoft/signalr";
import baseQueryWithReauth from ".";

export const bookingApi = createApi({
    reducerPath : "bookingApi",
    baseQuery : baseQueryWithReauth,
    tagTypes:["booking"],
    endpoints : (builder)=>({
        createBooking : builder.mutation<void,BookingInput>({
            query: (data)=>({
                url: "/Booking/createBooking",
                method : "POST",
                body : data
            }),
            invalidatesTags : ["booking"]
        }),
        fetchAllBookings : builder.query<paging<BookingPayload[]>, fetchBookingArgs>({
            query:(data)=>({
                url : `/Booking/getAllBookings?pageNumber=${data.currentPage}&pageSize=${data.pageSize}&searchUser=${data.searchUser}&roomNumber=${data.roomFilter}&statusFilter=${data.statusFilter}`
            }),
            providesTags:["booking"],
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                const connection = new HubConnectionBuilder()
                    .withUrl(`${import.meta.env.VITE_API_BASE_URL}/hubs/bookings`)
                    .withAutomaticReconnect()
                    .build();

                try {
                    await cacheDataLoaded;
                    await connection.start();

                    connection.on("ReceiveBookingUpdate", (newBooking: BookingPayload) => {
                        updateCachedData((draft) => {
                            const existingIndex = draft.data.findIndex(b => b.id === newBooking.id);
                                
                            if (existingIndex !== -1) {
                                draft.data[existingIndex] = { ...draft.data[existingIndex], ...newBooking };
                            } else if (arg.currentPage === 1) {
                                draft.data.unshift(newBooking);
                                if (draft.data.length > arg.pageSize) draft.data.pop();
                            }
                        });
                    });
                } catch {}
                await cacheEntryRemoved;
                connection.stop();
            }
        }),
        cancelBooking : builder.mutation<void , number>({
            query : (id)=>({
                url:`/Booking/${id}/cancelBooking`,
                method:"POST"
            }),
            invalidatesTags:["booking"]
        }),
        fetchBookingByRange : builder.query<BookingPayload[],fetchBookingsByRangeArgs>({
            query : (dates)=>({
                url : `/Booking/getBookingsByRange?start=${dates.startDate}&end=${dates.endDate}`,
            }),
            providesTags:["booking"],
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                const connection = new HubConnectionBuilder()
                    .withUrl(`${import.meta.env.VITE_API_BASE_URL}/hubs/bookings`)
                    .withAutomaticReconnect()
                    .build();

                try {
                    await cacheDataLoaded;
                    await connection.start();
                    
                    connection.on("ReceiveBookingUpdate", (newBooking: BookingPayload) => {
                        updateCachedData((draft) => {
                            const existingIndex = draft.findIndex(b => b.id === newBooking.id);

                            if (existingIndex !== -1) {
                                draft[existingIndex] = { ...draft[existingIndex], ...newBooking };
                            } else {
                                const bookingDate = new Date(newBooking.checkInDate);
                                const start = new Date(arg.startDate);
                                const end = new Date(arg.endDate);

                                if (bookingDate >= start && bookingDate <= end) {
                                    draft.push(newBooking);
                                }
                            }
                        });
                    });
                } catch {}
                await cacheEntryRemoved;
                connection.stop();
            }
        }),
        updateBooking : builder.mutation<void,BookingInput>({
            query : (data)=>({
                url : `/Booking/updateBooking/${data.id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags : ["booking"]
        }),
        checkIn : builder.mutation<void,number>({
            query : (id)=>({
                url : `/Booking/checkIn/${id}`,
                method : "PUT",
                body:id,
            }),
            invalidatesTags : ["booking"],
        }),
        checkOut : builder.mutation<void,number>({
            query : (id)=>({
                url: `Booking/checkOut/${id}`,
                method : "PUT",
                body : id,
            }),
            invalidatesTags: ["booking"]
        }),
        fetchUserBookings : builder.query<paging<BookingPayload[]>,fetchUserBookingArgs>({
            query : (data)=>({
                url: `/Booking/myBookings?pageNumber=${data.currentPage}&pageSize=${data.pageSize}&roomNumber=${data.roomFilter}&statusFilter=${data.statusFilter}`
            }),
            providesTags : ["booking"],
        })
    })
})

export const {
    useCreateBookingMutation,
    useFetchAllBookingsQuery,
    useCancelBookingMutation,
    useFetchBookingByRangeQuery,
    useLazyFetchBookingByRangeQuery,
    useUpdateBookingMutation,
    useCheckInMutation,
    useCheckOutMutation,
    useFetchUserBookingsQuery,
} = bookingApi;