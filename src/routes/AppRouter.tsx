import { Routes, Route, Navigate } from "react-router-dom";
import { lazy , Suspense } from "react";
import AdminOnlyRoutes from "./AdminOnlyRoutes";

const Login = lazy(()=>import("@/pages/login"));
const Home = lazy(() => import("@/pages/home/home"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const ForgotPassword = lazy(() => import("@/pages/forgotPassword"));
const ResetPassword = lazy(() => import("@/pages/resetPassword"));
const ChangePassword = lazy(() => import("@/pages/changePassword"));
const UserManagement = lazy(() => import("@/components/userManagement"));
const RoomManagement = lazy(() => import("@/components/roomManagement"));
const BookingManagement = lazy(() => import("@/components/bookingManagement"));
const GuestManagement = lazy(() => import("@/components/guestManagement"));
const CheckInOutManagement = lazy(() => import("@/pages/checkIn-Out"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const AdminLayout = lazy(() => import("@/components/layouts/AdminLayout"));
const ProtectedRoutes = lazy(() => import("./protectedRoutes"));
const PublicRoutes = lazy(() => import("./publicRoutes"));
const MyBookings = lazy(()=> import("@/pages/myBookings"));

export default function AppRouter() {
  return (
    <Suspense fallback="loading..." >
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
          <Route  path="bookings" element={<MyBookings/>}/>
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route element={<AdminOnlyRoutes/>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="rooms" element={<RoomManagement />} />
            </Route>
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="checkings" element={<CheckInOutManagement />} />
            <Route path="guests" element={<GuestManagement/>}/>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
