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

  const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  const handleClick = () => {
    if (location.pathname !== path) {
      navigate(path);
    }
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className={`
        cursor-pointer px-4 py-3 transition-all duration-200 rounded-l-2xl font-bold text-sm
        ${
          isActive
            ? "text-primary bg-primary/5 border-r-4 border-primary shadow-sm"
            : "text-text-muted hover:bg-layout hover:text-text-main"
        } 
        ${className}
      `}
    >
      {label}
    </div>
  );
};

export default SidebarItem;