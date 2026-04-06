import type { ButtonProps } from "@/utils/interfaces/button";

const Button = ({ children, label, className = "", ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`
        rounded-xl bg-primary px-4 py-2.5 text-surface font-black text-xs uppercase tracking-widest 
        transition-all duration-200 shadow-lg shadow-primary/20 
        hover:bg-primary-hover hover:cursor-pointer active:scale-95 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${className}
      `}
    >
      {children ?? label}
    </button>
  );
};

export default Button;