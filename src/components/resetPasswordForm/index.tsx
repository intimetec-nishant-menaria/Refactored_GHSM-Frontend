import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/input/Input";
import Label from "@/components/common/label/Label";
import Button from "@/components/common/button/Button";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/utils/schemas/resetPassword";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useResetPasswordMutation } from "@/app/Api/auth";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation();
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

  const onSubmit =async (data: ResetPasswordInput) => {
    if (!token || !email) {
      toast.error("Invalid or expired reset link");
      return;
    }
    
      try{
        await resetPassword({
          email,
          token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }).unwrap();
        toast.success("Password reset successful!");
        navigate("/", { replace: true });
      }catch(err:any){
          toast.error(err?.data.message || "Failed to reset password",
        );
      }
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
      <Button type="submit" label="Reset Password" ></Button>
    </form>
  );
};

export default ResetPasswordForm;
