import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/app/slices/auth";
import userReducer from "@/app/slices/user";
import roomReducer from "@/app/slices/room";
import roomTypeReducer from "@/app/slices/roomType";
import availableRoomReducer from "@/app/slices/availableRoom";
import bookingSliceReducer from "@/app/slices/booking";
import amenitiesSlice from "@/app/slices/amenities";
import guestReducer from "@/app/slices/guest";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    room: roomReducer,
    roomType: roomTypeReducer,
    availableRooms: availableRoomReducer,
    booking: bookingSliceReducer,
    amenities: amenitiesSlice,
    guest : guestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
