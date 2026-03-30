export interface MenuItem {
  label: string;
  path: string;
}

export const menuByRole: Record<string, MenuItem[]> = {
  Admin: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "User Management", path: "/admin/users" },
    { label: "Room Management", path: "/admin/rooms" },
    { label: "Booking Management", path: "/admin/bookings" },
    { label: "Check-in/Check-out", path: "/admin/checkings" }
  ],
  Ops: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Room Management", path: "/admin/rooms" },
    { label: "User Management", path: "/admin/users" },
    { label: "Booking Management", path: "/admin/bookings" },
    { label: "Check-in/Check-out", path: "/admin/checkings" }
  ]
};
