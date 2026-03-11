import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/input";
import Label from "@/components/common/label";
import Button from "@/components/common/button";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/utils/schemas/resetPasswordSchema";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store/store";
import { resetPassword } from "@/app/asyncThunk/authThunk";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useRef } from "react";

const ResetPasswordForm = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token, email } = useQueryParams<{
    token: string | null;
    email: string | null;
  }>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordInput) => {
    if (!token || !email) {
      toast.error("Invalid or expired reset link");
      return;
    }
    dispatch(
      resetPassword({
        email,
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    ).then((resultAction) => {
      if (resetPassword.fulfilled.match(resultAction)) {
        toast.success("Password reset successful!");
        navigate("/");
      } else {
        toast.error(
          (resultAction.payload as string) || "Failed to reset password",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="Enter new password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm password"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button type="submit" label="Reset Password" ref={ref}></Button>
    </form>
  );
};

export default ResetPasswordForm;
