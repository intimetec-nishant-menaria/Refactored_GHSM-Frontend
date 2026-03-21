import profile from "@/assets/profile.png";
import menuIcon from "@/assets/menuIcon.png";
import { useAppSelector } from "@/hooks/useAppSelector";
import Button from "../button/Button";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png"

interface TopbarProps {
  onMenuClick?: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="h-16 w-full bg-white shadow-sm flex items-center px-4 md:px-6 shrink-0 z-30">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-md md:hidden transition-colors"
              aria-label="Open Menu"
            >
              <img src={menuIcon} alt="menu" className="w-6 h-6" />
            </button>
          )}

          <div className="h-8 md:h-10 flex items-center">
            <img
              className="h-full w-auto object-contain cursor-pointer"
              src={logo}
              alt="logo"
              onClick={() => navigate("/")}
            />
          </div>
        </div>

        <div className="flex items-center">
          {user != null ? (
            <div className="relative group flex items-center gap-3 py-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-800 leading-none">
                  {user.name}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                  {user.role}
                </span>
              </div>

              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-100 cursor-pointer group-hover:ring-2 group-hover:ring-blue-300 transition-all">
                <img
                  src={profile}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute right-0 top-full pt-1 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform group-hover:translate-y-0 translate-y-2 z-50">
                <div className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate mb-2">
                      {user.email}
                    </p>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 uppercase">
                      {user.role}
                    </span>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => navigate("/change-password")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>🔑</span> Change Password
                    </button>
                    <div className="my-2 border-t border-gray-100"></div>

                    <button
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium flex items-center gap-2 cursor-pointer"
                      onClick={() => {}}
                    >
                      <span>🚪</span> Log Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                label="SignUp"
                className="w-20 h-9 text-sm bg-blue-600 text-white"
                onClick={() => navigate("/register")}
              />
              <Button
                label="Login"
                className="w-20 h-9 text-sm bg-blue-600 text-white"
                onClick={() => navigate("/login")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
