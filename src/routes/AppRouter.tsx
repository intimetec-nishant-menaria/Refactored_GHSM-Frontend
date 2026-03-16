import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/login";
import ForgotPassword from "@/pages/forgotPassword";
import ResetPassword from "@/pages/resetPassword";
import ChangePassword from "@/pages/changePassword";
import AdminLayout from "@/components/layouts/AdminLayout";
import UserManagement from "@/components/userManagement";
import RoomManagement from "@/components/roomManagement";
import ProtectedRoutes from "./protectedRoutes";
import PublicRoutes from "./publicRoutes";
import Home from "@/pages/home/home";
import BookingManagement from "@/components/bookingManagement";
import Calendar from "@/components/common/Calendar/calendar";
import CheckInOutManagement from "@/pages/checkIn-Out";
import GuestManagement from "@/components/guestManagement";
import SignUp from "@/pages/SignUp";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp/>} />
      </Route>

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Calendar />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="checkings" element={<CheckInOutManagement />} />
          <Route path="guests" element={<GuestManagement/>}/>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
