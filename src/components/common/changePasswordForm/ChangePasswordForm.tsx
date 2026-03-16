import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/common/input/Input";
import Label from "@/components/common/label/Label";
import Button from "@/components/common/button/Button";

import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/utils/schemas/changePassword";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store/store";

import { changePassword } from "@/app/asyncThunk/auth";
import { useNavigate } from "react-router-dom";

const ChangePasswordForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordInput) => {
    dispatch(
      changePassword({
        OldPassword: data.OldPassword,
        NewPassword: data.NewPassword,
      }),
    ).then((resultAction) => {
      if (changePassword.fulfilled.match(resultAction)) {
        toast.success("Password changed successfully!", {
          duration: 2000,
        });
        navigate("/");
      } else {
        toast.error(
          (resultAction.payload as string) || "Failed to change password",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="oldPassword">Old Password: </Label>
        <Input
          id="oldPassword"
          type="password"
          {...register("OldPassword")}
          placeholder="Enter old password"
        />
        {errors.OldPassword && (
          <p className="text-red-500 text-sm">{errors.OldPassword.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="newPassword">New Password: </Label>
        <Input
          id="newPassword"
          type="password"
          {...register("NewPassword")}
          placeholder="Enter new password"
        />
        {errors.NewPassword && (
          <p className="text-red-500 text-sm">{errors.NewPassword.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmNewPassword">Confirm New Password: </Label>
        <Input
          id="confirmNewPassword"
          type="password"
          {...register("ConfirmPassword")}
          placeholder="Confirm new password"
        />
        {errors.ConfirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.ConfirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" label="Change Password" className="w-full" />
    </form>
  );
};

export default ChangePasswordForm;
