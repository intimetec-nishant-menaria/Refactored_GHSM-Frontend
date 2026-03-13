import AuthLayout from "@/components/layouts/AuthLayout";
import SignUpForm from "@/components/signUpForm/SignUpForm";

const SignUp = () => {
  return (
    <AuthLayout title="SignUp">
        <SignUpForm/>
    </AuthLayout>
  );
};

export default SignUp;
