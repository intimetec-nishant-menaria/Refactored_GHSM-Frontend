import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/app/slices/authSlice";
import userReducer from "@/app/slices/userSlice";
import roomReducer from "@/app/slices/roomSlice";
import roomTypeReducer from "@/app/slices/roomTypeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    room: roomReducer,
    roomType: roomTypeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
