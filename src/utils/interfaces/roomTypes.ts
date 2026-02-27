export interface RoomTypesPayload {
  id: number;
  roomNumber:string;
  roomTypeId:number;
  roomTypeName: string;
  capacity: number;
  pricePerNight: number;
  roomStatus :number;
}

export interface RoomState {
  rooms: RoomTypesPayload[];
  loading: boolean;
  error: string | null;
}

export interface RoomType{
  id : number;
  roomTypeName : string;
  capacity : number;
  pricePerNight : number;
  amenities : string[];
}

export interface RoomTypeState{
  roomTypes : RoomType[];
  loading : boolean;
  error : string | null;
}

