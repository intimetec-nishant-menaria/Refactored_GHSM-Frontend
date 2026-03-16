import { createAsyncThunk } from "@reduxjs/toolkit";
import apiThunk from ".";
import type { Amenity } from "@/utils/interfaces/amenity";

export const fetchAmenitis = createAsyncThunk(
  "api/fetchAmenities",
  async (_, { rejectWithValue }) => {
    try {
      return await apiThunk<Amenity[]>("/roomtypes/amenities");
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("something went wrong");
    }
  },
);
