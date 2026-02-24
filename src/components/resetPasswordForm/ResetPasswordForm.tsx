import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/input";
import Label from "@/components/common/label";
import Button from "@/components/common/button";
import { resetPasswordSchema, type ResetPasswordInput,} from "@/utils/schemas/resetPasswordSchema";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store/store";
import { resetPassword } from "@/app/asyncThunk/authThunk";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token: string | null = searchParams.get("token");
  const email: string | null = searchParams.get("email");
  const { register, handleSubmit, formState: { errors },} = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    const resultAction = await dispatch(
      resetPassword({
        email,
        token,
        password: data.password,
        confirmPassword : data.confirmPassword,
      }),
    );

    if (resetPassword.fulfilled.match(resultAction)) {
      toast.success("Password reset successful!");
      navigate('/');
    } else {
      toast.error(resultAction.payload as string);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="password">New Password</Label>
        <Input id="password" type="password" {...register("password")} placeholder="Enter new password"/>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" type="password" {...register("confirmPassword")} placeholder="Confirm password" />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button type="submit" label="Reset Password"></Button>
    </form>
  );
};

export default ResetPasswordForm;
