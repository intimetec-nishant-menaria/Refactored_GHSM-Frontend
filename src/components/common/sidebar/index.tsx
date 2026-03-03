import crossIcon from "@/assets/crossIcon.png";
import SidebarItem from "./SidebarItem";
import { menuByRole } from "./menuConfig";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/app/asyncThunk/authThunk";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const role = user?.role || "Guest";
  const menuItems = menuByRole[role as keyof typeof menuByRole] || [];

  function handleLogout() {
    try {
      dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-slate-500 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:flex md:flex-col md:w-full`}
      >
        <div className="h-16 p-6 border-b border-slate-700 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-semibold leading-tight">Guesthouse</h2>
            <p className="text-xs text-slate-300 capitalize">{role}</p>
          </div>
          <button className="md:hidden p-1 hover:bg-slate-600 rounded" onClick={() => setIsOpen(false)}>
            <img src={crossIcon} alt="close" className="w-5 h-5 invert" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
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