import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createUser, fetchUsers } from "@/app/asyncThunk/userThunk";
import { useForm } from "react-hook-form";
import { addUserSchema, type addUserInput } from "@/utils/schemas/addUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateUserModal = ({ closeModel }: {closeModel:()=>void}) => {
  const dispatch = useAppDispatch();
  const {
    register , 
    handleSubmit,
    formState : {errors}
  } = useForm<addUserInput>({
    resolver : zodResolver(addUserSchema),
    defaultValues: {
      name:"",
      email:"",
      role : 3,
      password:"",
      isActive: true,
    },
  })

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
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ✓
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserModal;
