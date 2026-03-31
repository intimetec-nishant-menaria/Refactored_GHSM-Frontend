export interface RoomData{
  id: number;
  roomNumber:string;
  floor: number;
  status :number;
  currentOccupancy? : number;
}

export interface UpdateRoomPayload{
    id : number;
    roomNumber : string;
    status : number;
    floor : number;
}

export interface RoomAvailabilityRequest{
    gender : number;
    checkIn : string | null; 
    checkOut : string | null;
}

export interface fetchAllRoomArgs{
    currentPage:number;
    pageSize:number;
    roomStatusFilter:number;
    roomNumberFilter:string;
}