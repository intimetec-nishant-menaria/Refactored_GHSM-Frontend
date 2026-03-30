import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthGuard from "./authGard";

const Login = lazy(() => import("@/pages/login"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const UserManagement = lazy(() => import("@/components/userManagement"));
const RoomManagement = lazy(() => import("@/components/roomManagement"));
const AuditLogPage = lazy(() => import("@/pages/AuditLog/index")); 
import BookingManagement from "@/components/bookingManagement";
const CheckInOutManagement = lazy(() => import("@/pages/checkIn-Out"));
const AdminLayout = lazy(() => import("@/components/layouts/AdminLayout"));

const AvailabilityDashboard = lazy(() => import("@/pages/dashboard/AvalabilityDashboard"));

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <Routes>
        <Route element={<AuthGuard isPublicOnly />}>
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
              <Route path="/hr/availability" element={<AvailabilityDashboard />} />
            </Route>

            <Route element={<AuthGuard allowedRoles={["Guard"]} />}>
              <Route path="/guard/bookings" element={<CheckInOutManagement/>} />
            </Route>
            
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}