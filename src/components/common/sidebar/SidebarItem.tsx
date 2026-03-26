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
      className={`cursor-pointer px-4 py-2 transition-colors duration-200 hover:bg-gray-200 rounded-l-lg
        ${
          isActive
            ? "text-blue-500 border-r-4 border-blue-500"
            : ""
        } ${className}`}
    >
      {label}
    </div>
  );
};

export default SidebarItem;
