import type { PagingMetaData } from "./paging";

export interface CreateBookingPayload{
    roomId : number ; 
    guestId : number ;
    guestEmail : string;
    checkInDate : string ;
    checkOutDate : string;
    specialRequests?: string;
}

export interface BookingPayload{
    id : number;
    guestId : number ;
    guestName : string;
    guestEmail : string;
    roomId : number ; 
    roomNumber : string;
    checkInDate : string ;
    checkOutDate : string;
    status : number;
}

export interface BookingState{
    bookings : BookingPayload[];
    paging : PagingMetaData;
    loading : boolean;
    error : string | null; 
}

export interface updateBookingPayload{
    id : number;
    checkIn : string;
    checkOut : string;
    status : number;
}