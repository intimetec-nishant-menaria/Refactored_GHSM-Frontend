import type { AuthLayoutProps } from "@/utils/interfaces/authLayout";

const AuthLayout = ({ title, children, iconSrc, iconAlt }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        {iconSrc && (
          <div className="mx-auto mb-4 w-16 h-16 rounded-full  flex items-center justify-center">
            <img src={iconSrc} alt={iconAlt || "Icon"} className="w-10 h-10" />
          </div>
        )}
        {children}
    </div>
  );
};

export default AuthLayout;
