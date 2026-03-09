import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createUser, fetchUsers } from "@/app/asyncThunk/userThunk";
import { useForm } from "react-hook-form";
import { addUserSchema, type addUserInput } from "@/utils/schemas/addUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateUserModal = ({ closeModel }: {closeModel:()=>void}) => {
  const dispatch = useAppDispatch();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
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

  const onSubmit = async (data:addUserInput) => {
    await dispatch(createUser(data));
    await dispatch(fetchUsers());
    closeModel();
  };

  return (
    <div className="absolute top-0 right-0 mt-12 mr-4 w-96 bg-white p-6 rounded-lg shadow-lg z-50">
      <h2 className="text-xl font-bold mb-4">Create User</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Name"
          className="border px-3 py-2 rounded"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          className="border px-3 py-2 rounded"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
        <select id="RoomType"
            {...register('role')} 
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500">
            <option key="1" value={1}>Admin</option>
            <option key="2" value={2}>Staff</option>
            <option key="3" value={3}>Guest</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
        )}
        <input
          type="password"
          placeholder="Password"
          className="border px-3 py-2 rounded"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("isActive")}
          />
          Active
        </label>

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={closeModel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</label>
            <input
              id="name"
              type="text"
              className={`border px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-400 focus:ring-red-100' : 'focus:ring-blue-100 border-slate-200'}`}
              {...register("name")}
            />
            {errors.name && <p className="text-red-500 text-xs font-medium italic">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</label>
            <input
              id="email"
              type="email"
              className={`border px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-400 focus:ring-red-100' : 'focus:ring-blue-100 border-slate-200'}`}
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-xs font-medium italic">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <label htmlFor="role" className="text-sm font-semibold text-slate-700">Assign Role</label>
              <select 
                id="role"
                {...register('role', { valueAsNumber: true })} 
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
                <span className="text-sm font-semibold text-slate-700">Account Active</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`border px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-400 focus:ring-red-100' : 'focus:ring-blue-100 border-slate-200'}`}
              {...register("password")}
            />
            {errors.password && <p className="text-red-500 text-xs font-medium italic">{errors.password.message}</p>}
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