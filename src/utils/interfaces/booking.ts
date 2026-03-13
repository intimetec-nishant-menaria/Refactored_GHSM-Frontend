export interface CreateBookingPayload{
    roomId : number ; 
    userId : number ;
    checkInDate : string ;
    checkOutDate : string;
    specialRequests?: string;
}

export interface BookingPayload{
    bookingId : number;
    roomId : number ; 
    roomNumber : string;
    userId : number ;
    userEmail : string;
    checkInDate : string ;
    checkOutDate : string;
    status : number;
}

export interface BookingState{
    bookings : BookingPayload[],
    loading : boolean,
    error : string | null, 
}

export interface updateBookingPayload{
    id : number;
    checkIn : string;
    checkOut : string;
    status : number;
}