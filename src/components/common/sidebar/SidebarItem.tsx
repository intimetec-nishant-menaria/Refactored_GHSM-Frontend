import { useNavigate, useLocation } from "react-router-dom";

interface SidebarItemProps {
  label: string;
  path: string;
  onClick?: () => void;
  className?: string;
}

const SidebarItem = ({
  label,
  path,
  onClick,
  className = "",
}: SidebarItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname.startsWith(path);

  const handleClick = () => {
    if (location.pathname !== path) {
      navigate(path);
    }
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer px-4 py-2 rounded-lg transition-colors duration-200
        ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-500 hover:text-white"
        } ${className}`}
    >
      {label}
    </div>
  );
};

export default SidebarItem;
