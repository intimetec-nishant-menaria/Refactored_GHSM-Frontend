import { useState } from "react";
import type { User } from "@/utils/interfaces/user";
import toast from "react-hot-toast";
import type { UpdateModelProps } from "@/utils/interfaces/updateModel";
import { useUpdateUserMutation } from "@/app/Api/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUserSchema, type updateUserInput } from "@/utils/schemas/updateUser";

const UpdateUserForm = ({ closeModel, data }: UpdateModelProps<User>) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<updateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      isActive: Boolean(data.isActive)
    }
  })

  const [updateUser] = useUpdateUserMutation();

  const handleOnSubmit = async (data: updateUserInput) => {
    setLoading(true);
    try {
      await updateUser(data).unwrap();
      toast.success("User updated successfully");
      closeModel();
    } catch (err: any) {
      toast.error(err?.data.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className="p-8 flex flex-col gap-6 bg-surface">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-sm font-semibold text-text-main"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`border px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-all bg-layout/10 text-text-main ${
            errors.name
              ? "border-danger focus:ring-danger/10"
              : "focus:ring-primary/10 border-border"
          }`}
        />
        {errors.name && (
          <p className="text-danger text-xs font-medium italic">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-semibold text-text-main"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={`border px-4 py-2.5 outline-none rounded-xl focus:ring-2 transition-all bg-layout/10 text-text-main ${
            errors.email
              ? "border-danger focus:ring-danger/10"
              : "focus:ring-primary/10 border-border"
          }`}
        />
        {errors.email && (
          <p className="text-danger text-xs font-medium italic">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-1.5">
          <label
            htmlFor="role"
            className="text-sm font-semibold text-text-main"
          >
            Role
          </label>
          <select
            id="role"
            {...register("role")}
            className="border border-border p-2.5 rounded-xl focus:ring-2 focus:ring-primary/10 bg-layout/10 text-text-main outline-none cursor-pointer"
          >
            <option value={"Admin"}>Admin</option>
            <option value={"HR"}>HR</option>
            <option value={"Guard"}>Guard</option>
          </select>
        </div>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-layout rounded-xl transition-colors">
            <input
              type="checkbox"
              {...register("isActive")}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary/30"
            />
            <span className="text-sm font-semibold text-text-main">
              Account Active
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-muted">
        <button
          type="button"
          onClick={closeModel}
          className="px-6 py-2.5 bg-muted text-text-muted font-bold rounded-xl hover:bg-border transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-primary text-surface font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:bg-primary/40 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update User"}
        </button>
      </div>
    </form>
  );
};

export default UpdateUserForm;