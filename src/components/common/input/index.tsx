import type { InputProps } from "@/utils/interfaces/input";

const Input = ({ type, className = "", ...props }: InputProps) => {
  const baseStyles =  "rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const checkboxStyles = "w-4 h-4 accent-blue-600 border-gray-300";

  return (
    <input
      type={type}
      {...props}
      className={`${
        type === "checkbox" ? checkboxStyles : `w-full ${baseStyles}`
      } 
      ${className}`}
    />
  );
};

export default Input;
