export interface Amenity {
  id: number;
  name: string;
}

export interface AmenitiesState {
  amenities: Amenity[];
  loading: boolean;
  error: string | null;
}
