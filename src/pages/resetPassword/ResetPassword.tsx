import ResetPasswordForm from "@/components/resetPasswordForm/ResetPasswordForm";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useQueryParams } from "@/hooks/useQueryParams";

const ResetPassword = () => {
  const { token } = useQueryParams();
  if (!token) {
    return <p className="text-red-500">Invalid or missing reset token.</p>;
  }

  return (
    <AuthLayout title="Reset Password">
      <div className="text-center">
        <p className="mt-2 text-sm text-gray-500">
          Enter your new password below to reset your account.
        </p>
        <ResetPasswordForm />
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
