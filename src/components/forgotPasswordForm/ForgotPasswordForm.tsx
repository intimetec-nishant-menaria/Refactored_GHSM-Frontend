import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/input";
import Label from "@/components/common/label";
import Button from "@/components/common/button";
import { Link } from "react-router-dom";
import { forgotPasswordSchema,type ForgotPasswordInput,} from "@/utils/schemas/forgotPasswordSchema";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store/store";
import { forgotPassword } from "@/app/asyncThunk/authThunk";
import toast from "react-hot-toast";

const ForgotPasswordForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, formState: { errors }, } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    const resultAction = await dispatch(forgotPassword(data));
    if (forgotPassword.fulfilled.match(resultAction)) {
      toast.success("Reset link sent to your email!");
    } else {
      toast.error(resultAction.payload as string);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      <div className="text-left">
        <Label htmlFor="email">Email:</Label>
        <Input id="email" {...register("email")} placeholder="Enter your email" className="mt-1" />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <Button type="submit" label="Reset Password"></Button>
      <div className="text-center">
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
