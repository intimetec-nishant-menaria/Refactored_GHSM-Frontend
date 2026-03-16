import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createUser, fetchUsers } from "@/app/asyncThunk/user";
import { useForm } from "react-hook-form";
import {
  addUserSchema,
  type addUserInput,
} from "@/utils/schemas/addUser";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const CreateUserModal = ({ closeModel }: {closeModel:()=>void}) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<addUserInput>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: 3,
      password: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: addUserInput) => {
    try {
      const resultAction = await dispatch(createUser(data));
      if (createUser.fulfilled.match(resultAction)) {
        toast.success("User created successfully!");
        await dispatch(fetchUsers());
        closeModel();
      } else {
        toast.error("Failed to create user");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex justify-center items-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in duration-300">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Add New User</h2>
            <p className="text-slate-500 text-sm">
              Assign roles and access for your team or guests.
            </p>
          </div>
          <button
            onClick={closeModel}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-all"
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-slate-700"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className={`border px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-all ${errors.name ? "border-red-400 focus:ring-red-100" : "focus:ring-blue-100 border-slate-200"}`}
              {...register("name")}
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
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`border px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-all ${errors.email ? "border-red-400 focus:ring-red-100" : "focus:ring-blue-100 border-slate-200"}`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-medium italic">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <label
                htmlFor="role"
                className="text-sm font-semibold text-slate-700"
              >
                Assign Role
              </label>
              <select
                id="role"
                {...register("role", { valueAsNumber: true })}
                className="border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 bg-white outline-none"
              >
                <option value={1}>Admin</option>
                <option value={2}>Staff</option>
                <option value={3}>Guest</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 justify-end pb-3">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  {...register("isActive")}
                />
                <span className="text-sm font-semibold text-slate-700">
                  Account Active
                </span>
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`border px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-all ${errors.password ? "border-red-400 focus:ring-red-100" : "focus:ring-blue-100 border-slate-200"}`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs font-medium italic">
                {errors.password.message}
              </p>
            )}
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
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;