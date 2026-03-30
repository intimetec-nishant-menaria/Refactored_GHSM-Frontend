

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

