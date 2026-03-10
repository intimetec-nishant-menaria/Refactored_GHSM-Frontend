import LoginForm from "@/components/loginForm/LoginForm";
import AuthLayout from "@/components/layouts/AuthLayout";

const Login = () => {
  return (
    <AuthLayout title="Login">
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
