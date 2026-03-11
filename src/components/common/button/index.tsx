import { forwardRef } from "react";
import type { ButtonProps } from "@/utils/interfaces/button";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      label,
      className = "",
      type = "button",
      variant = "primary",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "w-full rounded-lg py-2 font-medium transition focus:outline-none";

    const variantStyles = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      danger: "bg-red-600 text-white hover:bg-red-700",
    };

    const disabledStyles = disabled
      ? "opacity-50 cursor-not-allowed hover:bg-none"
      : "";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
        {...props}
      >
        {children ?? label}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
