import SidebarItem from "./SidebarItem";
import { menuByRole } from "./menuConfig";
import { useAppSelector } from "@/hooks/useAppSelector";
import { authAPi, useLogoutUserMutation } from "@/app/Api/auth";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logOut} from "@/app/slices/auth";
import { useNavigate } from "react-router-dom";
import { bookingApi } from "@/app/Api/booking";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const role = user?.role || "Guest";
  const menuItems = menuByRole[role as keyof typeof menuByRole] || [];

  async function handleLogout() {
    try {
      await logoutUser().unwrap();
      dispatch(logOut());
      dispatch(authAPi.util.resetApiState());
      dispatch(bookingApi.util.resetApiState());
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-text-main/40 backdrop-blur-sm z-40 md:hidden transition-all"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-16 border-r border-border left-0 z-50 w-64 h-[calc(100vh-4rem)] bg-surface shadow-2xl md:shadow-none transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex md:flex-col md:w-full md:h-full`}
      >
        <nav className="flex-1 w-full overflow-y-auto p-4 pr-0 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              label={item.label}
              path={item.path}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-muted bg-layout/10 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full bg-danger text-surface hover:bg-danger-hover py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-danger/20 active:scale-95 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;