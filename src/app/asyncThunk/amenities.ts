import { createAsyncThunk } from "@reduxjs/toolkit";
import apiThunk from ".";
import type { Amenity } from "@/utils/interfaces/amenity";

export const fetchAmenitis = createAsyncThunk(
  "api/fetchAmenities",
  async () => {
      return await apiThunk<Amenity[]>("/roomtypes/amenities");
  },
);
