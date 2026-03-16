import ChangePasswordForm from "@/components/common/changePasswordForm/ChangePasswordForm";
import AuthLayout from "@/components/layouts/AuthLayout";

const ChangePassword = () => {
  return (
    <>
      <AuthLayout title="Change Password">
        <ChangePasswordForm />
      </AuthLayout>
    </>
  );
};

export default ChangePassword;
