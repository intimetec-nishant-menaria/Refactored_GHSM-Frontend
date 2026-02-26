import AuthLayout from "@/components/layouts/AuthLayout";
import ForgotPasswordForm from "@/components/forgotPasswordForm/ForgotPasswordForm";
import questionSign from "@/assets/questionSign.png";

const ForgotPassword = () => {
  return (
    <AuthLayout
      title="Forgot Password?"
      iconSrc={questionSign}
      iconAlt="Forgot password"
    >
      <div className="text-center">
        <p className="mt-2 text-sm text-gray-500">
          No worries, we'll send you reset instructions.
        </p>

        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
