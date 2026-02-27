import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/input";
import Label from "@/components/common/label";
import Button from "@/components/common/button";
import { useNavigate } from "react-router-dom";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/utils/schemas/forgotPasswordSchema";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store/store";
import { forgotPassword } from "@/app/asyncThunk/authThunk";
import toast from "react-hot-toast";
import { useRef } from "react";
import type { RootState } from "@/app/store/store";

const ForgotPasswordForm = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { loading } = useSelector((state: RootState) => state.auth);

  const onSubmit = (data: ForgotPasswordInput) => {
    dispatch(forgotPassword(data)).then((resultAction) => {
      if (forgotPassword.fulfilled.match(resultAction)) {
        toast.success("Reset link sent to your email!");
      } else {
        toast.error(
          (resultAction.payload as string) || "Failed to send reset link",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      <div className="text-left">
        <Label htmlFor="email">Email:</Label>
        <Input
          id="email"
          {...register("email")}
          placeholder="Enter your email"
          className="mt-1"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <Button
        type="submit"
        label="Reset Password"
        disabled={loading}
        ref={ref}
      ></Button>
      <div className="text-center">
        <span
          onClick={() => navigate("/")}
          className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          ← Back to login
        </span>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
