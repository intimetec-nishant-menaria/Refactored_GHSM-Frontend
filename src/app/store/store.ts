import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/app/slices/authSlice";
import userReducer from "@/app/slices/userSlice";
import roomReducer from "@/app/slices/roomSlice";
import roomTypeReducer from "@/app/slices/roomTypeSlice";
import availableRoomReducer from "@/app/slices/availableRoomSlics";
import bookingSliceReducer from "@/app/slices/bookingSlice";
import amenitiesSlice from "@/app/slices/amenitiesSlice";
import guestReducer from "@/app/slices/guestSlice";

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
