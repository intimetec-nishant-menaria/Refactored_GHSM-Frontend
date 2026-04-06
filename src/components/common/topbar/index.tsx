import profile from "@/assets/profile.png";
import menuIcon from "@/assets/menuIcon.png";
import crossIcon from "@/assets/crossIcon.png";
import { useAppSelector } from "@/hooks/useAppSelector";
import Button from "../button/Button";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png"
import { authAPi, useLogoutUserMutation } from "@/app/Api's/auth";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { removeuser } from "@/app/slices/auth";
import { bookingApi } from "@/app/Api's/booking";
import ThemeToggle from "@/components/common/themeToggle";

interface TopbarProps {
  isMenuOpen: boolean;
  onMenuClick?: () => void;
}

const Topbar = ({ onMenuClick, isMenuOpen }: TopbarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  async function handleLogout() {
    try {
      await logoutUser().unwrap();
      dispatch(removeuser());
      dispatch(authAPi.util.resetApiState());
      dispatch(bookingApi.util.resetApiState());
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <div className="h-16 w-full bg-surface shadow-sm flex items-center px-4 md:px-6 shrink-0 z-30 border-b border-border/50 transition-colors duration-300">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-3">
          {(user?.role === "Admin" || user?.role === "Ops") && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-layout rounded-xl md:hidden transition-colors"
              aria-label="Open Menu"
            >
              <img
                src={isMenuOpen ? crossIcon : menuIcon}
                alt={isMenuOpen ? "close menu" : "open menu"}
                className="w-6 h-6"
              />
            </button>
          )}

          <div className="h-8 md:h-10 flex items-center">
            <img
              className="h-full w-auto object-contain"
              src={logo}
              alt="logo"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="h-8 w-px bg-border/50 hidden sm:block" /> {/* Subtle Divider */}
          {user != null ? (
            <div className="relative group flex items-center gap-3 py-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-text-main leading-none">
                  {user.name}
                </span>
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-black mt-1">
                  {user.role}
                </span>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-border overflow-hidden bg-layout cursor-pointer group-hover:ring-4 group-hover:ring-primary/10 transition-all">
                <img
                  src={profile}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute right-0 top-full pt-1 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform group-hover:translate-y-0 translate-y-2 z-50">
                <div className="bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-4 border-b border-muted bg-layout/30">
                    <p className="text-sm font-bold text-text-main truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-text-muted truncate mb-2">
                      {user.email}
                    </p>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full border border-primary/20 uppercase tracking-tighter">
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="p-2">
                    <button
                      className="w-full text-left px-3 py-2.5 text-sm text-danger hover:bg-danger/5 rounded-xl transition-colors font-bold flex items-center gap-2 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <span className="text-base">🚪</span> Log Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                label="SignUp"
                className="w-20 h-9 text-xs bg-muted text-text-main hover:bg-border font-bold rounded-xl"
                onClick={() => navigate("/register")}
              />
              <Button
                label="Login"
                className="w-20 h-9 text-xs bg-primary text-surface hover:bg-primary-hover font-bold rounded-xl shadow-lg shadow-primary/20"
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