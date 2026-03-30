export interface BookingPayload{
    id : number;
    bugId : number;
    guestId : number ;
    guestName : string;
    guestEmail : string;
    gender : number;
    roomId : number ; 
    roomNumber : string;
    checkInDate : string ;
    checkOutDate : string;
    status : number;
}

export interface fetchBookingArgs{
    currentPage:number;
    pageSize :number;
    searchUser:string;
    roomFilter:string;
    statusFilter:number;
}

export interface fetchBookingsByRangeArgs {
  startDate: string;
  endDate: string;
}

export interface fetchUserBookingArgs{
    currentPage:number;
    pageSize:number;
    roomFilter:string;
    statusFilter:number;
}