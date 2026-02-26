import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/app/slices/authSlice";
import userReducer from "@/app/slices/userSlice";
import roomReducer from "@/app/slices/roomSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    room: roomReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
