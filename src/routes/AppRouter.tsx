import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/login/Login";
import ForgotPassword from "@/pages/forgotPassword/ForgotPassword";
import ResetPassword from "@/pages/resetPassword/ResetPassword";
import AdminLayout from "@/components/layouts/AdminLayout";
import DashboardCards from "@/components/common/dashboard/dashboardCards";
import UserManagement from "@/components/userManagement/userManagement";
import RoomManagement from "@/components/roomManagement/roomManagement";
import ProtectedRoutes from "./protectedRoutes";
import PublicRoutes from "./publicRoutes";
import Home from "@/pages/home/home";
import BookingManagement from "@/components/bookingManagement/bookingManagement";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoutes/>}>
        <Route path="/login" element={<Login />} />
      </Route>
      
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<AdminLayout/>}>
        <Route path="/" element={<Home/>}/>
      </Route>

      <Route element={<ProtectedRoutes/>}> 
        <Route path="/admin" element={<AdminLayout/>}>
          <Route path="dashboard" element={<DashboardCards />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="bookings" element={<BookingManagement/>}/>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
