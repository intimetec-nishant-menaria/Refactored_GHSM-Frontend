import { NavLink } from "react-router-dom";

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
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-lg transition duration-200 
        ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-500 hover:text-white"}
        ${className}`
      }
    >
      {label}
    </NavLink>
  );
};

export default SidebarItem;
