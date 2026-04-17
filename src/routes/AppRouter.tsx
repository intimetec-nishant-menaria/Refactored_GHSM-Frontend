import { Routes, Route } from "react-router-dom";
import AuthGuard from "./authGuard";
import AdminLayout from "@/components/layouts/AdminLayout";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import UserManagement from "@/components/userManagement";
import RoomManagement from "@/components/roomManagement";
import BookingManagement from "@/components/bookingManagement";
import CheckInOutManagement from "@/pages/checkIn-Out";
import AuditLogPage from "@/pages/AuditLog/index";
import AvailabilityDashboard from "@/pages/dashboard/AvalabilityDashboard";
import NotFound from "@/pages/404NotFound";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthGuard isPublicOnly={true} />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<AuthGuard />}>
        <Route element={<AdminLayout />}>
          <Route element={<AuthGuard allowedRoles={["Admin", "Ops"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/rooms" element={<RoomManagement />} />
            <Route path="/admin/bookings" element={<BookingManagement />} />
            <Route path="/admin/checkings" element={<CheckInOutManagement />} />
            <Route path="/auditLog" element={<AuditLogPage />} />
          </Route>

          <Route element={<AuthGuard allowedRoles={["HR"]} />}>
            <Route path="/hr/dashboard" element={<AvailabilityDashboard />} />
          </Route>

          <Route element={<AuthGuard allowedRoles={["Guard"]} />}>
            <Route path="/guard/dashboard" element={<CheckInOutManagement />} />
          </Route>
        </Route>
      </Route>

      
      <Route element={<AuthGuard />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}