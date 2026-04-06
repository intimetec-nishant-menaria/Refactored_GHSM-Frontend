import type { AuthLayoutProps } from "@/utils/interfaces/authLayout";

const AuthLayout = ({ title, children, iconSrc, iconAlt }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md bg-surface p-8 shadow-xl rounded-2xl border border-border">
        <div className="flex flex-col items-center mb-8">
          {iconSrc && (
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <img 
                src={iconSrc} 
                alt={iconAlt || "Icon"} 
                className="h-10 w-10 object-contain" 
              />
            </div>
          )}
          
          <h1 className="text-2xl font-bold tracking-tight text-text-main">
            {title}
          </h1>
        </div>
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;