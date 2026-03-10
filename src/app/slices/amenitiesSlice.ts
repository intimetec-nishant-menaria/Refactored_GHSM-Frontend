import { createSlice } from "@reduxjs/toolkit";
import { fetchAmenitis } from "../asyncThunk/amenitiesThunk";
import type { AmenitiesState } from "@/utils/interfaces/amenity";

const initialState: AmenitiesState = {
  amenities: [],
  loading: false,
  error: null,
};

const amenitiesSlice = createSlice({
  name: "amenities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAmenitis.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAmenitis.fulfilled, (state, action) => {
        state.loading = false;
        state.amenities = action.payload;
      })
      .addCase(fetchAmenitis.rejected, (state, action) => {
        state.error = action.error as string;
        state.loading = false;
      });
  },
});

export default amenitiesSlice.reducer;
