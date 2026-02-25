export interface MenuItem {
  label: string;
  path: string;
}

export const menuByRole: Record<string, MenuItem[]> = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Room Management", path: "/admin/rooms" },
    { label: "User Management", path: "/admin/users" },
    { label: "Bookings", path: "/admin/bookings" },
    { label: "Check-in", path: "/admin/checkings" },
    { label: "Guests", path: "/admin/guests" },
  ],
  user: [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Profile", path: "/user/profile" },
  ],
};
