import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";
import profile from "@/assets/profile.png";

const Topbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-end px-6">
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 hidden sm:block">
          Logged in as: <span className="font-medium">{user?.role}</span>
        </span>
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          <img src={profile} alt="role" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
