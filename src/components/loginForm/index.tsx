import Label from "@/components/common/label/Label";
import Input from "@/components/common/input/Input";
import Button from "@/components/common/button/Button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginInput } from "@/utils/schemas/login";
import { loginSchema } from "@/utils/schemas/login";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useLoginUserMutation } from "@/app/Api's/auth";

const LoginForm = () => {
  const navigate = useNavigate();
  const [loginUser, { data: responceUser }] = useLoginUserMutation();
  
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
    
    try {
      await loginUser(data).unwrap();
      toast.success("Welcome back!");
      
      if (responceUser?.user.role === "Admin" || responceUser?.user.role === "Ops")
        navigate("/admin/dashboard", { replace: true });
      else if (responceUser?.user.role === "HR") {
        navigate("/hr/dashboard", { replace: true });
      }
      else
        navigate("/guard/dashboard", { replace: true })
        
    } catch (err: any) {
      toast.error(err?.data.message || "Invalid credentials");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 pt-0 bg-surface rounded-xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-text-main tracking-tight">Welcome Back</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-semibold text-text-main">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className={`w-full transition-all duration-200 bg-layout/10 ${
              errors.email 
                ? 'border-danger focus:ring-danger/10' 
                : 'border-border focus:ring-primary/10'
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-danger text-xs font-medium mt-1 animate-in fade-in slide-in-from-top-1 italic">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-semibold text-text-main">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className={`w-full transition-all duration-200 bg-layout/10 ${
              errors.password 
                ? 'border-danger focus:ring-danger/10' 
                : 'border-border focus:ring-primary/10'
            }`}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-danger text-xs font-medium mt-1 animate-in fade-in slide-in-from-top-1 italic">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group p-1 rounded-lg hover:bg-layout transition-colors">
            <input 
              id="rememberMe" 
              type="checkbox" 
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
              {...register("rememberMe")} 
            />
            <span className="text-sm text-text-muted group-hover:text-text-main transition-colors font-medium">Remember me</span>
          </label>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-3 bg-primary hover:bg-primary-hover text-surface font-bold rounded-xl transition-all shadow-lg shadow-primary/20 active:transform active:scale-[0.98] disabled:bg-primary/40 disabled:cursor-not-allowed"
          label={isSubmitting ? "Signing in..." : "Login"}
        />
      </form>
    </div>
  );
};

export default LoginForm;