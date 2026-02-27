import Label from "@/components/common/label";
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginInput } from "@/utils/schemas/loginSchema";
import { loginSchema } from "@/utils/schemas/loginSchema";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store/store";
import { loginUser } from "@/app/asyncThunk/authThunk";
import { useRef } from "react";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<HTMLButtonElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    dispatch(loginUser(data)).then((resultAction) => {
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Logged in successfully!");
        navigate("/dashboard");
      } else {
        toast.error(resultAction.payload as string);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="email">Email:</Label>
        <Input
          id="email"
          type="text"
          placeholder="Email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password:</Label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <Label className="flex items-center gap-2 cursor-pointer">
          <Input id="rememberMe" type="checkbox" {...register("rememberMe")} />
          Remember me
        </Label>
        <span
          onClick={() => navigate("/forgot-password")}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Forgot password?
        </span>
      </div>
      <Button type="submit" label="Login" ref={ref}></Button>
    </form>
  );
};

export default LoginForm;
