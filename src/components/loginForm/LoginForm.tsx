import Label from "@/components/common/label/Label";
import Input from "@/components/common/input/Input";
import Button from "@/components/common/button/Button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginInput } from "@/utils/schemas/loginSchema";
import { loginSchema } from "@/utils/schemas/loginSchema";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store/store";
import { loginUser } from "@/app/asyncThunk/authThunk";
import { useEffect } from "react";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginInput) => {
    if (data.rememberMe) {
      localStorage.setItem("rememberedEmail", data.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
    
    const resultAction = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success("Welcome back!");
      navigate("/", { replace: true });
    } else {
      toast.error(resultAction.payload as string || "Invalid credentials");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 mt-2">Sign in to manage your Guest House</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            <p className="text-red-500 text-xs font-medium mt-1 animate-in fade-in slide-in-from-top-1">
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
            <p className="text-red-500 text-xs font-medium mt-1 animate-in fade-in slide-in-from-top-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              id="rememberMe" 
              type="checkbox" 
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              {...register("rememberMe")} 
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
          </label>
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-blue-600 font-medium hover:underline cursor-pointer transition-colors"
          >
            Forgot password?
          </span>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md active:transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          label={isSubmitting ? "Signing in..." : "Login"}
        />

        <div className="pt-4 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};


export default LoginForm;
