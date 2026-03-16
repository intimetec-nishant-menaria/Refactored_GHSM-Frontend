import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/input/Input";
import Label from "@/components/common/label/Label";
import Button from "@/components/common/button/Button";
import { useNavigate } from "react-router-dom";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/utils/schemas/forgotPassword";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store/store";
import { forgotPassword } from "@/app/asyncThunk/auth";
import toast from "react-hot-toast";
import type { RootState } from "@/app/store/store";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    dispatch(forgotPassword(data)).then((resultAction) => {
      if (forgotPassword.fulfilled.match(resultAction)) {
        toast.success("Reset link sent to your email!");
      } else {
        toast.error(
          (resultAction.payload as string) || "Failed to send reset link"
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5 w-full max-w-md mx-auto">
      
      <div className="flex flex-col items-start w-full">
        <Label htmlFor="email" className="mb-1.5 font-medium">
          Email Address
        </Label>
        <Input
          id="email"
          {...register("email")}
          placeholder="name@company.com"
          className={`w-full ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1 font-medium italic">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        label={loading ? "Sending..." : "Reset Password"}
        disabled={loading}
        className="w-full py-2.5 transition-all active:scale-[0.98]"
      />

      <div className="text-center mt-2">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-1 mx-auto"
        >
          <span>←</span> Back to login
        </button>
      </div>
    </form>
  );
};
export default ForgotPasswordForm;
