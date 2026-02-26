export interface RoomTypesPayload {
  id: number;
  roomTypeName: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
}

export interface RoomState {
  rooms: RoomTypesPayload[];
  loading: boolean;
  error: string | null;
}
