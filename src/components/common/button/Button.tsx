import type { ButtonProps } from "@/utils/interfaces/button";

const Button = ({ children, label, className = "", ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={` rounded-lg bg-blue-600 py-2 text-white font-medium transition x hover:cursor-pointer ${className}`}
    >
      {children ?? label}
    </button>
  );
};

export default Button;
