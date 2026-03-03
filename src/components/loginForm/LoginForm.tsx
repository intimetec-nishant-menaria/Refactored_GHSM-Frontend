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
    formState: { errors },
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
      toast.success("Logged in successfully!");
      navigate("/" , {replace:true});
    } else {
      toast.error(resultAction.payload as string);
    }
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
          <Input type="checkbox" {...register("rememberMe")} />
          Remember me
        </Label>

        <span
          onClick={() => navigate("/forgot-password")}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Forgot Password
        </span>
      </div>
      <Button type="submit" label="Login" className="w-full"></Button>
    </form>
  );
};

export default LoginForm;
