import AuthLayout from "@/components/layouts/AuthLayout";
import ForgotPasswordForm from "@/components/forgotPasswordForm";
import questionSign from "@/assets/questionSign.png";

const ForgotPassword = () => {
  return (
    <AuthLayout
      title="Forgot Password?"
      iconSrc={questionSign}
      iconAlt="Forgot password icon"
    >
      <div className="mx-aut w-full max-w-sm flex flex-col items-center">
        
        <header className="text-center mb-6">
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            No worries, enter your email below and we'll send you 
            <span className="block italic">reset instructions.</span>
          </p>
        </header>
        <div className="w-full">
          <ForgotPasswordForm />
        </div>
        
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;