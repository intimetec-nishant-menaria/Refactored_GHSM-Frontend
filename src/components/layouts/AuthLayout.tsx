import type { AuthLayoutProps } from "@/utils/interfaces/authLayout";

const AuthLayout = ({ title, children, iconSrc, iconAlt }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 sm:p-8 shadow-lg">
        {iconSrc && (
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <img src={iconSrc} alt={iconAlt || "Icon"} className="w-10 h-10" />
          </div>
        )}
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
