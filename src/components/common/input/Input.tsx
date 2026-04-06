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
      "rounded-xl border px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 transition-all bg-layout/10 text-text-main placeholder:text-text-muted/50";

    const variants = {
      default: "border-border focus:ring-primary/10 focus:border-primary",
      error: "border-danger focus:ring-danger/10 focus:border-danger",
    };

    const checkboxStyles = "w-5 h-5 accent-primary border-border rounded-lg cursor-pointer";

    const disabledStyles = disabled ? "opacity-40 cursor-not-allowed grayscale" : "";

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