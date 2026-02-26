import { Routes, Route } from "react-router-dom";
import Login from "@/pages/login/Login";
import ForgotPassword from "@/pages/forgotPassword/ForgotPassword";
import ResetPassword from "@/pages/resetPassword/ResetPassword";
import AdminLayout from "@/components/layouts/AdminLayout";
import DashboardCards from "@/components/common/dashboard/dashboardCards";
import UserManagement from "@/components/userManagement/userManagement";
import RoomManagement from "@/components/roomManagement/roomManagement";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardCards />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="rooms" element={<RoomManagement />} />
      </Route>
    </Routes>
  );
}