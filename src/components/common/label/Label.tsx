import type { LabelProps } from "./labelProps";

const Label = ({ children, className = "", ...props }: LabelProps) => {
  return (
    <label
      {...props}
      className={`text-sm font-semibold text-text-main tracking-tight ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;