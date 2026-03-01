import { useState, type ChangeEvent } from "react";
import menuIcon from "@/assets/menuIcon.png";
import crossIcon from "@/assets/crossIcon.png";
import SidebarItem from "./SidebarItem";
// import { useSelector } from "react-redux";
import { menuByRole } from "./menuConfig";
// import type { RootState } from "@/app/store/store";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/app/asyncThunk/authThunk";
import { useAppDispatch } from "@/hooks/useAppDispatch";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = "admin";
  const menuItems = menuByRole[role];
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout(){
    try {
      dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <div className="md:hidden p-4 bg-slate-500 text-white flex flex-col gap-3 items-center">
        <h2 className="font-semibold">Guesthouse</h2>
        <button onClick={() => setIsOpen(true)}>
          <img src={menuIcon} alt="menu" className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-slate-500 text-white transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex md:flex-col md:h-screen`}
      >
        <div className="h-16 p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Guesthouse</h2>
            <p className="text-sm text-slate-400">{role}</p>
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <img
              src={crossIcon}
              alt="cross"
              className="w-6 h-6 cursor-pointer"
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              label={item.label}
              path={item.path}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </div>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
