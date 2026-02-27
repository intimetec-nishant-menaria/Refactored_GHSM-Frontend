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