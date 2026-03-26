import SidebarItem from "./SidebarItem";
import { menuByRole } from "./menuConfig";
import { useAppSelector } from "@/hooks/useAppSelector";
import { authAPi, useLogoutUserMutation } from "@/app/Api's/auth";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { removeuser } from "@/app/slices/auth";
import { useNavigate } from "react-router-dom";

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
      dispatch(removeuser());
      dispatch(authAPi.util.resetApiState());
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`fixed top-16 border-r border-gray-300 left-0 z-50 w-64 h-[calc(100vh-4rem)] bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex md:flex-col md:w-full md:h-full`}
      >
        <nav className="flex-1 w-full overflow-y-auto p-4 pr-0 space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              label={item.label}
              path={item.path}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 py-2.5 rounded-md transition-colors font-medium text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;