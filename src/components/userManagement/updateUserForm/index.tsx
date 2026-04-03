import { useState} from "react";
import type { User } from "@/utils/interfaces/user";
import toast from "react-hot-toast";
import type { UpdateModelProps } from "@/utils/interfaces/updateModel";
import { useUpdateUserMutation } from "@/app/Api's/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUserSchema, type updateUserInput } from "@/utils/schemas/updateUser";

const UpdateUserForm = ({ closeModel, data }: UpdateModelProps<User>) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState : {errors}
  } = useForm<updateUserInput>({
    resolver : zodResolver(updateUserSchema),
    defaultValues : {
      id : data.id,
      name : data.name,
      email : data.email,
      role : data.role,
      isActive : Boolean(data.isActive)
    }
  })

  const [updateUser] = useUpdateUserMutation();

  const handleOnSubmit = async (data : updateUserInput) => {
    setLoading(true);
    try {
      await updateUser(data).unwrap();
      toast.success("User updated successfully");
      closeModel();
    } catch (err:any){
      toast.error(err?.data.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
        <form onSubmit={handleSubmit(handleOnSubmit)} className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-slate-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={`border px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-all ${
                errors.name
                  ? "border-red-400 focus:ring-red-100"
                  : "focus:ring-blue-100 border-slate-200"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs font-medium italic">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`border px-4 py-2.5 outline-none rounded-xl focus:ring-2 transition-all ${
                errors.email
                ? "border-red-400 focus:ring-red-100"
                : "focus:ring-blue-100 border-slate-200"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-medium italic">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-1.5">
              <label
                htmlFor="role"
                className="text-sm font-semibold text-slate-700"
              >
                Role
              </label>
              <select
                id="role"
                {...register("role")}
                className="border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 bg-white outline-none cursor-pointer"
              >
                <option value={"Admin"}>Admin</option>
                <option value={"HR"}>HR</option>
                <option value={"Guard"}>Guard</option>
              </select>
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Account Active
                </span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-50">
            <button
              type="button"
              onClick={closeModel}
              className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
  );
};

export default UpdateUserForm;