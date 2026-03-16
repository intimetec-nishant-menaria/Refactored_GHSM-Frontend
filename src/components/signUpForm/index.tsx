import Label from "@/components/common/label/Label";
import Input from "@/components/common/input/Input";
import Button from "@/components/common/button/Button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { registerUser } from "@/app/asyncThunk/auth";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { registerSchema, type RegisterInput } from "@/utils/schemas/register";

const SignUpForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    const resultAction = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("User registered successfully!");
      navigate("/login", { replace: true });
    } else {
      toast.error(resultAction.payload as string || "Registration failed");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl ">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
        <p className="text-gray-500 mt-2">Join our Guest House Management system</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            className={`w-full transition-all duration-200 ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200'}`}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs font-medium animate-in fade-in slide-in-from-top-1">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className={`w-full transition-all duration-200 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200'}`}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-medium animate-in fade-in slide-in-from-top-1">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className={`w-full transition-all duration-200 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200'}`}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs font-medium animate-in fade-in slide-in-from-top-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md active:transform active:scale-[0.98]"
          label={isSubmitting ? "Creating Account..." : "Register"}
        />

        <div className="pt-4 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:underline cursor-pointer transition-colors"
            >
              Login here
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;