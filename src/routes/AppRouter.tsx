import { Routes, Route } from "react-router-dom";
import Login from "@/pages/login/Login";
import ForgotPassword from "@/pages/forgotPassword/ForgotPassword";
import ResetPassword from "@/pages/resetPassword/ResetPassword";
import Dashboard from "@/pages/dashboard/Dashboard";
import AdminLayout from "@/components/layouts/AdminLayout";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        {/* <Route path="rooms" element={<Rooms />} />
        <Route path="users" element={<Users />} /> */}
      </Route>
    </Routes>
  );
}