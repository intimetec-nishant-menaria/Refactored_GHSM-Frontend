import profile from "@/assets/profile.png";
import inTimeTeclogo from '@/assets/inTimeTecLogo.png';
import menuIcon from "@/assets/menuIcon.png";
import { useAppSelector } from "@/hooks/useAppSelector";
import Button from "../button/Button";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
  onMenuClick?: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user } = useAppSelector(state => state.auth);
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
              src={inTimeTeclogo} 
              alt="logo" 
              onClick={() => navigate("/")}
            />
          </div>
        </div>
        <div className="flex items-center">
          {user != null ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-800 leading-none">
                  {user.name}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                  {user.role}
                </span>
              </div>
              
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-blue-100 transition-all">
                <img 
                  src={profile} 
                  alt="profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                label="Register" 
                className="hidden xs:block w-20 h-9 text-sm" 
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