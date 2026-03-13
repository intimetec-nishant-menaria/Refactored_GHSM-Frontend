import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "error";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      className = "",
      variant = "default",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 transition";

    const variants = {
      default: "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
      error: "border-red-500 focus:ring-red-500 focus:border-red-500",
    };

    const checkboxStyles = "w-4 h-4 accent-blue-600 border-gray-300";

    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

    return (
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${
          type === "checkbox"
            ? checkboxStyles
            : `w-full ${baseStyles} ${variants[variant]}`
        } ${disabledStyles} ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
