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
    checkInDate : string | null; 
    checkOutDate : string | null;
}