import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/app/slices/auth";
import { availableRoomApi } from "../Api/availableRoom";
import { bookingApi } from "../Api/booking";
import { userApi } from "../Api/user";
import { roomAPi } from "../Api/room";
import { roomTypeApi } from "../Api/roomType";
import { guestApi } from "../Api/guest";
import { amenitiesApi } from "../Api/amenities";
import { authAPi } from "../Api/auth";
import { auditApi } from "../Api/auditLog";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authAPi.reducerPath]:authAPi.reducer,
    [userApi.reducerPath]:userApi.reducer,
    [roomAPi.reducerPath]:roomAPi.reducer,
    [roomTypeApi.reducerPath]:roomTypeApi.reducer,
    [availableRoomApi.reducerPath]:availableRoomApi.reducer,
    [bookingApi.reducerPath]:bookingApi.reducer,
    [amenitiesApi.reducerPath]:amenitiesApi.reducer,
    [guestApi.reducerPath] : guestApi.reducer,
    [auditApi.reducerPath] : auditApi.reducer
  },
    middleware : (getDefaultMiddleware)=>
        getDefaultMiddleware().concat(
          availableRoomApi.middleware,
          bookingApi.middleware,
          userApi.middleware,
          roomAPi.middleware,
          roomTypeApi.middleware,
          guestApi.middleware,
          amenitiesApi.middleware,
          authAPi.middleware,
          auditApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
