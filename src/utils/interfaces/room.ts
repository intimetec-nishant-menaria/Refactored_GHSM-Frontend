export interface RoomData{
    roomNumber : string;
    roomTypeId : number;
}

export interface UpdateRoomPayload{
    id : number;
    roomNumber : string;
    roomTypeId : number;
    roomStatus : number;
}

export interface RoomAvailabilityRequest{
    checkIn : string | null; 
    checkOut : string | null;
}

export interface fetchAllRoomArgs{
    currentPage:number;
    pageSize:number;
    roomStatusFilter:number;
    roomTypeFilter:number;
}