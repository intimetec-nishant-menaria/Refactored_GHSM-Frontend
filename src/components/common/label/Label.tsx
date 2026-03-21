import type { LabelProps } from "./labelProps";

const Label = ({ children, className = "", ...props }: LabelProps) => {
  return (
    <label
      {...props}
      className={`font-medium text-sm text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
